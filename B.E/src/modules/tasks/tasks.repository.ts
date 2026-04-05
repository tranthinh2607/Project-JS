import { Task, ITask } from "./tasks.model"
import mongoose from "mongoose"

export default {
    async findById(id: string) {
        return await Task.findById(id).lean()
    },

    async findByProject(projectId: string, keyword?: string, priority?: string) {
        const match: any = {
            project_id: new mongoose.Types.ObjectId(projectId),
            parent_task_id: null
        }

        if (priority) {
            match.priority = priority
        }

        if (keyword) {
            match.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }

        // Get root tasks with subtask count and current status
        return await Task.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "parent_task_id",
                    as: "subtasks"
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            {
                $unwind: { path: "$creator", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "task_status",
                    let: { taskId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$task_id", "$$taskId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "current_status"
                }
            },
            {
                $lookup: {
                    from: "task_assignees",
                    let: { taskId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$task_id", "$$taskId"] } } },
                        {
                            $lookup: {
                                from: "User",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "u"
                            }
                        },
                        { $unwind: "$u" },
                        {
                            $project: {
                                _id: "$u._id",
                                name: "$u.name",
                                avatar: "$u.avatar"
                            }
                        }
                    ],
                    as: "assignees"
                }
            },
            {
                $addFields: {
                    _latestStatus: { $arrayElemAt: ["$current_status", 0] }
                }
            },
            {
                $addFields: {
                    subtask_count: { $size: "$subtasks" },
                    created_name: "$creator.name",
                    status: { $ifNull: ["$_latestStatus.status", "todo"] },
                    status_note: { $ifNull: ["$_latestStatus.note", null] },
                    priority_name: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$priority", "low"] }, then: "Thấp" },
                                { case: { $eq: ["$priority", "medium"] }, then: "Trung bình" },
                                { case: { $eq: ["$priority", "high"] }, then: "Cao" }
                            ],
                            default: "Trung bình"
                        }
                    }
                }
            },
            {
                $project: {
                    subtasks: 0,
                    creator: 0,
                    current_status: 0,
                    _latestStatus: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ])
    },

    async findSubtasks(parentTaskId: string) {
        return await Task.aggregate([
            {
                $match: {
                    parent_task_id: new mongoose.Types.ObjectId(parentTaskId)
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            {
                $unwind: { path: "$creator", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "task_status",
                    let: { taskId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$task_id", "$$taskId"] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "current_status"
                }
            },
            {
                $lookup: {
                    from: "task_assignees",
                    let: { taskId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$task_id", "$$taskId"] } } },
                        {
                            $lookup: {
                                from: "User",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "u"
                            }
                        },
                        { $unwind: "$u" },
                        {
                            $project: {
                                _id: "$u._id",
                                name: "$u.name",
                                avatar: "$u.avatar"
                            }
                        }
                    ],
                    as: "assignees"
                }
            },
            {
                $addFields: {
                    _latestStatus: { $arrayElemAt: ["$current_status", 0] }
                }
            },
            {
                $addFields: {
                    created_name: "$creator.name",
                    status: { $ifNull: ["$_latestStatus.status", "todo"] },
                    status_note: { $ifNull: ["$_latestStatus.note", null] }
                }
            },
            {
                $project: {
                    creator: 0,
                    current_status: 0,
                    _latestStatus: 0
                }
            },
            { $sort: { createdAt: 1 } }
        ])
    },

    async create(data: Partial<ITask>) {
        const task = new Task(data)
        return await task.save()
    },

    async update(id: string, data: Partial<ITask>) {
        return await Task.findByIdAndUpdate(id, data, { new: true }).lean()
    },

    async deleteWithSubtasks(id: string) {
        // Delete all subtasks first
        await Task.deleteMany({ parent_task_id: new mongoose.Types.ObjectId(id) })
        // Then delete the task itself
        return await Task.findByIdAndDelete(id)
    }
}
