import { z } from 'zod';
 
const descriptionSchema = z.string().superRefine((value, ctx) => {
    const cleaned = value.replace(/\s+/g, " ").trim(); // Remove extra spaces & new lines
  
    if (cleaned.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description can't be empty",
      });
    }
    else if(cleaned.length < 10){
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 10,
        type: "string",
        inclusive: true,  // Whether the minimum is included in the range of acceptable values.  true -> value >= 10 , false -> value > 10
        message: "Description must be at least 10 characters long",
      });
    }
  
});

const slugSchema = z.string()
.max(100, 'Slug must not exceed 100 characters')
.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,  'Invalid slug format, Only lowercase letters, numbers, and hyphens (-) are allowed, No spaces or special characters, No leading or trailing hyphens, No consecutive hyphens (--)')
.or(z.literal("")) // allow empty string for auto generation if no slug passed from the form

const priceSchema = z.number({ 
        required_error: "Price is required",
        invalid_type_error: "Price must be a number" 
})
.positive("Price must be a positive number")
 
const stockSchema =z.number({ 
    required_error: "Stock is required",
    invalid_type_error: "Stock must be a number" 
})
.int("Stock must be an integer number")
.nonnegative("Stock must be a non-negative number")


const filesSchema = z.array(
    z.object({
      mimetype: z.string().regex(/^image\/.+$/, 'Only Images are allowed as Uploaded files'),
      path: z.string(),
    })
).max(4, "You can upload up to 4 images only.")


export const productSchema = z.object({
    title: z.string().trim()
        .min(3,'Title of Product must be at least 3 characters long')
        .max(100,'Title must not exceed 100 characters'),    
    slug: slugSchema,
    description: descriptionSchema,
    category: z.string().nonempty("You must select a category"),
    price: priceSchema,
    stock: stockSchema,
    files: filesSchema
});

export type zProduct = z.infer<typeof productSchema>; 