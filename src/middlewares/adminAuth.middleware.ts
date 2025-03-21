import { Request, Response, NextFunction, RequestHandler } from "express";

export const isAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.user){
        req.flash('errors', 'Please Login with admin account');
        res.redirect('/auth/login');
        return;
    }
    if(req.session.user.role !== 'admin'){
        req.flash('errors', 'Please Login with admin account');
        res.redirect('/');
        return;
    }

    next();
};