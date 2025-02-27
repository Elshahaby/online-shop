import {Schema, model} from 'mongoose'
import { IPage } from '../types/Page'

const pageSchema = new Schema<IPage>(
    {
        title: { type: String, required: true },
        slug: { type: String },
        content: { type: String, required: true },
        sorting: { type: Number },
    },
    { timestamps: true }
)

export const PageModel = model<IPage>('page', pageSchema)