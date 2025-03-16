import { Request, Response, NextFunction } from "express";

export const cartMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.cart = req.session.cart;
    next();
};