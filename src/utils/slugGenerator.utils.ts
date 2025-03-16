import slugify from "slugify";
import { Category } from "../models/index";

/**
 * Generates a unique slug based on the given title.
 * Ensures the slug does not already exist in the database.
 */
export const generateUniqueSlug = async (title: string, categoryId?: string): Promise<string> => {
    if (!title || typeof title !== "string" || title.trim() === "") {
        throw new Error("Invalid title for slug generation.");
    }

    // Clean title before slugifying
    let cleanedTitle = title.replace(/[&$%|]/g, "");
    let slug = slugify(cleanedTitle, { lower: true, strict: true, remove: /[*+~.()'"!@#^:;,]/ });

    if (!slug)  throw new Error("Invalid slug generated, Title can't have special chars only");
    
    const existingCategory = await Category.findOne({ slug, _id:{'$ne': categoryId} }); 
    if (existingCategory) {
        throw new Error("Slug must be unique. Try a different title or slug.");
    }

    return slug;
};
