import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().nonempty('Title is required, can not be empty'),
  slug: z.string().optional(),
});

export type CategoryType = z.infer<typeof categorySchema>; 