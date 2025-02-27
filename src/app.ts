import dotenv from 'dotenv';
import path from "path" 
import connectDB from './config/db.config'; 
import express,{Request, Response,NextFunction} from "express"
import sessionMiddleware from './middlewares/session.middleware';
import {flahsLocalMiddleware, flashMiddleware} from './middlewares/flash.middleware';
import authRoutes from './routes/auth.routes'
import adminRoutes from './routes/admin.routes'

dotenv.config({ path: path.resolve(__dirname, './config/config.env') });

const app = express();  


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.use(sessionMiddleware);
app.use(flashMiddleware);
app.use(flahsLocalMiddleware);

app.get('/',(req: Request, res: Response) => {
    res.render('index', {userId: req.session.userId, title: 'Home'});
})
app.use('/auth', authRoutes);
app.use('/admin/pages', adminRoutes);

const port = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});


// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//     next(new Error('Route Not found'));
// })

// app.use(errorHandler);


