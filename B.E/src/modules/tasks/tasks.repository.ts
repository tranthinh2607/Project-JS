import { Task, ITask } from "./tasks.model"
import mongoose from "mongoose"

const diacriticAwareRegex = (text: string) => {
    if (!text) return ""
    let pattern = text
        .replace(/[aàáảãạăằắẳẵặâầấẩẫậ]/gi, "[aàáảãạăằắẳẵặâầấẩẫậ]")
        .replace(/[eèéẻẽẹêềếểễệ]/gi, "[eèéẻẽẹêềếểễệ]")
        .replace(/[iìíỉĩị]/gi, "[iìíỉĩị]")
        .replace(/[oòóỏõọôồốổỗộơờớởỡợ]/gi, "[oòóỏõọôồốổỗộơờớởỡợ]")
        .replace(/[uùúủũụưừứửữự]/gi, "[uùúủũụưừứửữự]")
        .replace(/[yỳýỷỹỵ]/gi, "[yỳýỷỹỵ]")
        .replace(/[dđ]/gi, "[dđ]")
    return pattern
}

export default {
    async findById(id: string) {
        return await Task.findById(id).lean()
    },

    async findWithDetail(id: string) {
        const result = await Task.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
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
                    project_name: "$project.name",
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
                    creator: 0,
                    current_status: 0,
                    _latestStatus: 0
                }
            }
        ])
        return result[0] || null
    },

    async findByProject(projectId: string, keyword?: string, priority?: string) {
        const match: any = {
            project_id: new mongoose.Types.ObjectId(projectId),
            parent_task_id: null
        }

        if (priority && priority !== "all") {
            match.priority = priority
        }

        // Keyword search is moved to pipeline stages

        const pipeline: any[] = [
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
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
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
                    project_name: "$project.name",
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
            }
        ]

        if (keyword) {
            const regex = new RegExp(diacriticAwareRegex(keyword), "i")
            pipeline.push({
                $match: {
                    $or: [
                        { title: regex },
                        { description: regex },
                        { created_name: regex },
                        { "assignees.name": regex }
                    ]
                }
            })
        }

        pipeline.push(
            {
                $project: {
                    subtasks: 0,
                    creator: 0,
                    current_status: 0,
                    _latestStatus: 0
                }
            },
            { $sort: { createdAt: -1 } }
        )

        return await Task.aggregate(pipeline)
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
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
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
                    project_name: "$project.name",
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
        await Task.deleteMany({ parent_task_id: new mongoose.Types.ObjectId(id) })
        return await Task.findByIdAndDelete(id)
    },

    async findTasks(params: {
        projectIds?: mongoose.Types.ObjectId[]
        assignedTaskIds?: mongoose.Types.ObjectId[]
        createdBy?: mongoose.Types.ObjectId
        keyword?: string
        priority?: string
        status?: string
        projectId?: string
        skip: number
        limit: number
    }) {
        const match: any = {}

        const orConditions: any[] = []
        if (params.projectIds && params.projectIds.length > 0) {
            orConditions.push({ project_id: { $in: params.projectIds } })
        }
        if (params.assignedTaskIds && params.assignedTaskIds.length > 0) {
            orConditions.push({ _id: { $in: params.assignedTaskIds } })
        }
        if (params.createdBy) {
            orConditions.push({ created_by: params.createdBy })
        }

        if (orConditions.length > 0) {
            match.$or = orConditions
        } else if (!params.projectId) {
            match._id = new mongoose.Types.ObjectId()
        }

        if (params.projectId && mongoose.Types.ObjectId.isValid(params.projectId)) {
            match.project_id = new mongoose.Types.ObjectId(params.projectId)
        }

        if (params.priority && params.priority !== "all") {
            match.priority = params.priority
        }

        const pipeline: any[] = [
            { $match: match },
            {
                $lookup: {
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "User",
                    localField: "created_by",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
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
                        { $unwind: "$u" }
                    ],
                    as: "assignees"
                }
            },
            {
                $addFields: {
                    _latestStatus: { $arrayElemAt: ["$current_status", 0] },
                    assignees: {
                        $map: {
                            input: "$assignees",
                            as: "a",
                            in: {
                                _id: "$$a.u._id",
                                name: "$$a.u.name",
                                avatar: "$$a.u.avatar"
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    status: { $ifNull: ["$_latestStatus.status", "todo"] },
                    status_note: { $ifNull: ["$_latestStatus.note", null] },
                    creator_name: "$creator.name",
                    project_name: "$project.name",
                    project_info: {
                        _id: "$project._id",
                        title: "$project.name",
                        code: "$project.code"
                    },
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
            }
        ]

        if (params.keyword) {
            const regex = new RegExp(diacriticAwareRegex(params.keyword), "i")
            pipeline.push({
                $match: {
                    $or: [
                        { title: regex },
                        { description: regex },
                        { project_name: regex },
                        { creator_name: regex },
                        { "assignees.name": regex }
                    ]
                }
            })
        }

        if (params.status && params.status !== "all") {
            pipeline.push({ $match: { status: params.status } })
        }

        const countPipeline = [...pipeline, { $count: "total" }]
        
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: params.skip },
            { $limit: params.limit },
            {
                $project: {
                    creator: 0,
                    current_status: 0,
                    _latestStatus: 0,
                    project: 0
                }
            }
        )

        const [data, countResult] = await Promise.all([
            Task.aggregate(pipeline),
            Task.aggregate(countPipeline)
        ])

        return {
            tasks: data,
            total: countResult[0]?.total || 0
        }
    },
}
