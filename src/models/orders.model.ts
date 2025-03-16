import { Schema, Types, model} from 'mongoose'
import { IOrder } from '../types/Order'


const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending'
        },
    },
    { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);