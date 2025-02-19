import flash from 'connect-flash';
import {Request, Response,NextFunction, RequestHandler } from 'express';

// Configure flash 
export const flashMiddleware: RequestHandler = flash();

// Make flash messages availabale in all EJS templetes
export const flahsLocalMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    res.locals.success = req.flash('success');
    res.locals.errors   = req.flash('errors');
    next();
};