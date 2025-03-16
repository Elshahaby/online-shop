import express, { Application } from "express";
import path from "path";

export const configureExpress = (app: Application) => {
    app.set('view engine','ejs');
    app.set('views',path.join(__dirname,'../../views'));
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../../public')));
    app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
};