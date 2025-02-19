import dotenv from 'dotenv';
import path from 'path';
import MongoStore from 'connect-mongo';


dotenv.config({ path: path.resolve(__dirname, './config.env') });

const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URL;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined');
}
if(!mongoUri){
    throw new Error('Data Base URL is Not Found');
}


export const sessionConfig = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        ttl: 60*60*24*30,
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000*60*60*24*30,
    },
};