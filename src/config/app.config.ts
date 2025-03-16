import express,{Request, Response, NextFunction} from "express"
import { configureExpress } from './express.config';
import middlewares from '../middlewares';
import routes from '../routes';
import { loadPages } from '../utils/loadPages.utils';
import { loadCategories } from '../utils/loadCategories.utils';
import { errorHandler } from '../middlewares/error.middleware';

export const app = express();

export const createApp = () => {
    configureExpress(app);
    middlewares.forEach(mw => app.use(mw));
    
    loadPages(app);
    loadCategories(app);
    
    app.use(routes);
    
    app.all('*', (req: Request, res: Response, next: NextFunction) => next(new Error('Route Not found')));
    app.use(errorHandler);
    
    return app;
};