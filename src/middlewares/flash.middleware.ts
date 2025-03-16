import flash from 'connect-flash';
import {Request, Response,NextFunction, RequestHandler } from 'express';

// Configure flash 
export const flashMiddleware: RequestHandler = flash();

// Make flash messages availabale in all EJS templetes
export const flahsLocalMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    res.locals.success = req.flash('success');
    res.locals.errors   = req.flash('errors');
    res.locals.formData = req.session.formData || {}; // Pass form data
    res.locals.user  = req.session.user || null;

    if(req.session.formData)delete req.session.formData; // Clear after one use
    next();
};