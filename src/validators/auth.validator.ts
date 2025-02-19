import { z } from 'zod';

export const signUpSchema = z.object({
    username: z.string().regex(/^[A-Za-z\s]+$/, 'Full Name must not contain numbers'),
    email: z.string().email('Invalid Email Address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password must be at most 64 character long')
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/,'Password must contain at least one number, one uppercase letter, and one lowercase letter'),
    confirmPassword: z.string(),
    role: z.enum(['user', 'admin']).optional().default('user'), 
}).refine(data => data.password === data.confirmPassword,{
    message: 'Passwords do not match',
    path: ['confirmedPassword'], 
});

export type SignUp = z.infer<typeof signUpSchema>;


// login schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password must be at most 64 character long')
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/,'Password must contain at least one number, one uppercase letter, and one lowercase letter'),
});

export type Login = z.infer<typeof loginSchema>;