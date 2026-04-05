import mongoose, { Schema, Model, Document } from "mongoose"

export interface ICounter extends Document {
    name: string // Sequence name, e.g., 'projects_2604'
    seq: number
}

const CounterSchema = new Schema<ICounter>({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
})

export const Counter: Model<ICounter> = mongoose.model<ICounter>("Counter", CounterSchema, "Counter")
