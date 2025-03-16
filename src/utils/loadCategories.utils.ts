import { Category } from '../models/category.model'
import { Express } from "express";


export const loadCategories = async (app: Express) => {
  try {
    const categories = await Category.find().lean();
    app.locals.categories = categories; 
  } catch (error) {
    console.error("Error loading Categories:", error);
  }
};
