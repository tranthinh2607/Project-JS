import mongoose from "mongoose"
import { Project } from "../projects/projects.model"
import { ProjectMember } from "../project-members/project-members.model"
import { Task } from "../tasks/tasks.model"
import { TaskStatus, TaskStatusEnum } from "../tasks/status/task-status.model"
import { User } from "../auth/auth.model"
import dayjs from "dayjs"

export default {
    async getStats(userId: string, startDate?: string, endDate?: string) {
        // Find User to get Email
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("Không tìm thấy user")
        }

        // Determine date range filters
        const start = startDate ? dayjs(startDate).startOf("day").toDate() : dayjs().subtract(30, "day").toDate()
        const end = endDate ? dayjs(endDate).endOf("day").toDate() : dayjs().toDate()

        // 1. Get Projects the user is involved in
        const members = await ProjectMember.find({ email: user.email })
        const projectIdsFromRoles = members.map(m => m.project_id)

        const projects = await Project.find({
            $or: [
                { owner_id: new mongoose.Types.ObjectId(userId) },
                { _id: { $in: projectIdsFromRoles } }
            ]
        })
        const projectIds = projects.map(p => p._id)

        // Count Active Projects (Assume all valid connected projects are active)
        const active_projects = projectIds.length

        // 2. Count Total Tasks and Completed Tasks within range, inside involved projects
        const totalTasksRange = await Task.countDocuments({
            project_id: { $in: projectIds },
            createdAt: { $gte: start, $lte: end }
        })

        // Find how many tasks were marked DONE in this range
        const completedTaskStatuses = await TaskStatus.aggregate([
            {
                $match: {
                    status: TaskStatusEnum.DONE,
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: "$task_id"
                }
            }
        ])

        // Ensure these tasks actually belong to the user's projects
        const completedTaskIds = completedTaskStatuses.map(t => t._id)
        const validatedCompletedTasks = await Task.countDocuments({
            _id: { $in: completedTaskIds },
            project_id: { $in: projectIds }
        })

        // Count unique members in these projects
        const uniqueMembers = await ProjectMember.distinct("email", { project_id: { $in: projectIds } })
        const total_members = uniqueMembers.length

        // 3. Gather Recent Activities
        const activities: Array<{ title: string, description: string, time: Date, type: string }> = []

        // A. Tasks recently completed
        const recentDones = await TaskStatus.find({
            status: TaskStatusEnum.DONE,
            task_id: { $in: completedTaskIds }
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("task_id")
            .populate("changed_by")

        for (const done of recentDones) {
            activities.push({
                title: "Công việc hoàn thành",
                // @ts-ignore
                description: `Task "${done.task_id?.title || 'Không rõ'}" đã được hoàn thành bởi @${done.changed_by?.username || 'khách'}`,
                time: done.createdAt,
                type: "task"
            })
        }


        return {
            data: {
                active_projects,
                tasks_completed: validatedCompletedTasks,
                total_members
            },
        }
    }
}
