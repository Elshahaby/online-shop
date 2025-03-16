import dotenv from 'dotenv';
import path from "path" 
import { createApp } from './config/app.config';
import { initializeDatabase } from './config/database';

dotenv.config({ path: path.resolve(__dirname, './config/config.env') });

export const app = createApp();

const port = process.env.PORT || 5000;
initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});