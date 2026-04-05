import { IProject, Project } from "./projects.model"
import { CreateProjectDto, UpdateProjectDto } from "./dto/projects.dto"
import { Counter } from "@core/database/counter.model"

export default {
    async generateProjectCode(): Promise<string> {
        const now = new Date()
        const year = now.getFullYear().toString().slice(-2)
        const month = (now.getMonth() + 1).toString().padStart(2, "0")
        const yearMonth = `${year}${month}` // e.g., "2604"
        const counterName = `projects_${yearMonth}`

        const counter = await Counter.findOneAndUpdate(
            { name: counterName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )

        const seq = counter.seq.toString().padStart(5, "0") // 5 digits, e.g., "00001"
        return `PJ${yearMonth}${seq}`
    },

    async create(data: CreateProjectDto & { owner_id: string }): Promise<IProject> {
        const code = await this.generateProjectCode()
        const project = new Project({ ...data, code })
        return await project.save()
    },

    async findById(id: string): Promise<any | null> {
        const project = await Project.findById(id).populate("owner_id", "name").lean().exec()
        if (project && project.owner_id) {
            return {
                ...project,
                owner_name: (project.owner_id as any).name,
                owner_id: project.owner_id._id
            }
        }
        return project
    },

    async findByOwner(owner_id: string): Promise<IProject[]> {
        return await Project.find({ owner_id }).exec()
    },

    async update(id: string, data: UpdateProjectDto): Promise<IProject | null> {
        return await Project.findByIdAndUpdate(id, data, { new: true }).exec()
    },

    async delete(id: string): Promise<IProject | null> {
        return await Project.findByIdAndDelete(id).exec()
    },

    async findAll(): Promise<IProject[]> {
        return await Project.find().exec()
    }
}
