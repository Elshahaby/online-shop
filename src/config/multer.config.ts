import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from "path";
import fs from 'fs-extra'
import sharp from 'sharp';
import { promisify } from "util";



const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
    destination: async (req: Request, file, cb) => {
        const productName = req.body.title.replace(/\s+/g, "_").toLowerCase();
        const productImageFolder = path.join(UPLOADS_DIR, productName);
        await fs.ensureDir(productImageFolder);  // create the folder if not created
        cb(null, productImageFolder);
    },
    filename: (req: Request, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(!file.mimetype.startsWith("image/")){
        return cb(new Error("Only Upload Images, only image files are allowed !!"))
    }
    cb(null, true);
}

export const upload = multer({
    storage, 
    fileFilter,
    limits: { fileSize: 7*1024*1024, files: 4 }
}).array("images", 4);// Accept up to 4 images 
// If using .array("images", 4)
// req.files will always be an array, even if only one file is uploaded.


// to catch multer error in catch block of each specific route
export const uploadMiddleware = promisify(upload);

// processing and deletion images function
export const processImages = async (productName: string, files: Express.Multer.File[]) => {
    try{
        const processedImages: string[] = [];
        const productFolder = path.join('uploads', productName);
      
        for (const file of files) {
            const newFilePath = path.join(productFolder, `resized-${file.filename}`);
            const oldFilePath = file.path;

            const fileBuffer = await fs.readFile(file.path);

            const imageBuffer = await sharp(fileBuffer)
                .resize(500, 500)
                .toFormat("jpeg")
                .jpeg({ quality: 80 })
                .toBuffer();

            await fs.writeFile(newFilePath, imageBuffer);
            console.log("Saved resized image:", newFilePath);

            if (fs.existsSync(oldFilePath)) {
                await fs.remove(oldFilePath);
                console.log("Deleted original file:", oldFilePath);

            }
            processedImages.push("\\" + newFilePath.replace('/\\/g',"/"));
        }
        return processedImages;
    }catch(error){
        console.error("Error processing image:", error);
    }
};
  
export const deleteProductImages = async (productName: string) => {
    const productFolder = path.join(UPLOADS_DIR, productName);
    if (await fs.pathExists(productFolder)) {
        await fs.remove(productFolder);
    }
};