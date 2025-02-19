import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, './config.env') });

const URL = process.env.MONGO_URL;

if (!URL) {
    throw new Error('Data Base URL is Not Found');
}

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDB;