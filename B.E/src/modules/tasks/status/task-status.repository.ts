import { TaskStatus, ITaskStatus } from "./task-status.model"
import mongoose from "mongoose"

export default {
    async create(data: Partial<ITaskStatus>) {
        const doc = new TaskStatus(data)
        return await doc.save()
    },

    async getLatestStatus(taskId: string) {
        const statuses = await TaskStatus.find({ task_id: new mongoose.Types.ObjectId(taskId) })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
        return statuses[0] || null
    },

    async getStatusHistory(taskId: string) {
        return await TaskStatus.aggregate([
            { $match: { task_id: new mongoose.Types.ObjectId(taskId) } },
            { $sort: { createdAt: 1 } },
            {
                $setWindowFields: {
                    sortBy: { createdAt: 1 },
                    output: {
                        old_status: {
                            $shift: {
                                output: "$status",
                                by: -1,
                                default: null
                            }
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "User",
                    localField: "changed_by",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    task_id: 1,
                    new_status: "$status",
                    old_status: 1,
                    note: 1,
                    changed_by: 1,
                    changed_name: "$user.name",
                    createdAt: 1
                }
            }
        ])
    }
}
