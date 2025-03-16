import { PageModel } from '../models/page.model'
import { Express } from "express";


export const loadPages = async (app: Express) => {
  try {
    const pages = await PageModel.find().sort({sorting: 1}).lean();
    app.locals.pages = pages; 
  } catch (error) {
    console.error("Error loading pages:", error);
  }
};
