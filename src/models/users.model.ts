import { Schema, model } from 'mongoose';
import { IUser } from '../types/User';


const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    { timestamps: true }
);
 
export const User = model<IUser>('User', userSchema);