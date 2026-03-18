import { IProject, Project } from "./projects.model"
import { CreateProjectDto, UpdateProjectDto } from "./dto/projects.dto"

export default {
    async create(data: CreateProjectDto & { owner_id: string }): Promise<IProject> {
        const project = new Project(data)
        return await project.save()
    },

    async findById(id: string): Promise<IProject | null> {
        return await Project.findById(id).exec()
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
