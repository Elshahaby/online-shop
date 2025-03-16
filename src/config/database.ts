import connectDB from './db.config';

export const initializeDatabase = async () => {
    await connectDB();
};