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

        const start = startDate ? dayjs(startDate).startOf("day").toDate() : dayjs().subtract(30, "day").toDate()
        const end = endDate ? dayjs(endDate).endOf("day").toDate() : dayjs().toDate()

        const members = await ProjectMember.find({ email: user.email })
        const projectIdsFromRoles = members.map(m => m.project_id)

        const projects = await Project.find({
            $or: [
                { owner_id: new mongoose.Types.ObjectId(userId) },
                { _id: { $in: projectIdsFromRoles } }
            ]
        })
        const projectIds = projects.map(p => p._id)

        const active_projects = projectIds.length

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

        const completedTaskIds = completedTaskStatuses.map(t => t._id)
        const validatedCompletedTasks = await Task.countDocuments({
            _id: { $in: completedTaskIds },
            project_id: { $in: projectIds }
        })

        const uniqueMembers = await ProjectMember.distinct("email", { project_id: { $in: projectIds } })
        const total_members = uniqueMembers.length

        return {
            data: {
                active_projects,
                tasks_completed: validatedCompletedTasks,
                total_members
            },
        }
    }
}
