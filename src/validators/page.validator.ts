import { z } from 'zod';

export const pageSchema = z.object({
    id: z.string().optional(),
    title: z.string().trim()
        .min(3,'Title of page must be at least 3 characters long')
        .max(100,'Title must not exceed 100 characters'),
    slug: z.string()
        .max(100, 'Slug must not exceed 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,  'Invalid slug format, Only lowercase letters, numbers, and hyphens (-) are allowed, No spaces or special characters, No leading or trailing hyphens, No consecutive hyphens (--)')
        .or(z.literal("")), // allow empty string
    content: z.string().trim().nonempty('Content must have a vaule'),
    sorting: z.number().positive().optional(),
});

export type Page = z.infer<typeof pageSchema>; 