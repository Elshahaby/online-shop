import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const errorHandlerFunction = (
    redirectPath: string
): ErrorRequestHandler => {
    return (error: unknown, req: Request, res: Response, next: NextFunction) => {

        if(error instanceof ZodError){
            const errors = error.errors.map(err => err.message);
            
            // expects the second parameter to be a string or an array of strings.
            req.flash('errors', errors);  // Flahs Validation errors
            return res.redirect(redirectPath);    
        }

        if(error instanceof Error){
            const errors = error.message;
            req.flash('errors', errors);
            return res.redirect(redirectPath);
        }
        
        req.flash('errors', 'Someting went wrong');
        res.redirect(redirectPath);

    };
};