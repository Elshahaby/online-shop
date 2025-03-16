import { Request, Response, NextFunction, RequestHandler } from "express";

export const isAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.user){
        req.flash('errors', 'Please Login first');
        return res.redirect('/');
    }

    next();
};