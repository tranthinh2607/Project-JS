import { TaskAssignee, ITaskAssignee } from "./task-assignee.model"
import mongoose from "mongoose"

export default {
    async create(data: Partial<ITaskAssignee>) {
        const doc = new TaskAssignee(data)
        return await doc.save()
    },

    async delete(taskId: string, userId: string) {
        return await TaskAssignee.deleteOne({
            task_id: new mongoose.Types.ObjectId(taskId),
            user_id: new mongoose.Types.ObjectId(userId)
        })
    },

    async findByTask(taskId: string) {
        return await TaskAssignee.aggregate([
            {
                $match: {
                    task_id: new mongoose.Types.ObjectId(taskId)
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: "$user._id",
                    name: "$user.name",
                    avatar: "$user.avatar"
                }
            }
        ])
    },

    async findByUser(userId: string) {
        return await TaskAssignee.find({ user_id: new mongoose.Types.ObjectId(userId) }).lean()
    }
}
