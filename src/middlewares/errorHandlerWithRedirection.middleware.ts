import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import multer from 'multer';
import { ZodError } from 'zod'
import fs from 'fs-extra'
import path from 'path';

export const errorHandlerFunction = (
    redirectPath: string
): ErrorRequestHandler => {
    return async (error: unknown, req: Request, res: Response, next: NextFunction) => {

        console.log('Error with Redirection')
        req.session.formData = req.body; // Store form data before redirecting you could add { ...req.body, ...req.files, ...res.file } if you want its content
        console.log("Form Data From Error Handler : ", req.session.formData);

       // 🛑 DELETE UPLOADED PRODUCT IMAGES IF VALIDATION FAILS
       if(req.files){

           const uploadedFiles = req.files as Express.Multer.File[];

           // Delete each uploaded file
           uploadedFiles.forEach((file) => {
               fs.unlinkSync(file.path);
           });

           console.log("New Files Uploaded is deleted");

           // 🛑 Check if the folder is empty, then delete the folder
           const productFolder = path.dirname(uploadedFiles[0].path); // Get the folder path

           try {
               const filesInFolder = fs.readdirSync(productFolder);
               if (filesInFolder.length === 0) {
                   fs.rmdirSync(productFolder); // Delete folder if empty
                   console.log(`Deleted empty folder: ${productFolder}`);
               }
           } catch (folderError) {
               console.error("Error checking folder:", folderError);
           } 
        }
        
        if(error instanceof ZodError){
            const errors = error.errors.map(err => err.message);
            console.log("Zod Error");
            req.flash('errors', errors); 
            return res.redirect(redirectPath);    
        }
        
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_COUNT") {
                req.flash("errors", "You can only upload up to 4 images!");
            } else if (error.code === "LIMIT_FILE_SIZE") {
                req.flash("errors", "File size must be under 7MB!");
            } else {
                req.flash("errors", "Multer error: " + error.message);
            }
            return res.redirect(redirectPath);
        }

        if(error instanceof Error){
            console.log("Generic Error");

            const errors = error.message;
            req.flash('errors', errors);
            return res.redirect(redirectPath);
        }
        

        console.log("Unknow Error");
        req.flash('errors', 'Someting went wrong');
        res.redirect(redirectPath);

    };
};