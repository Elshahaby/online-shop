export interface IUser {
    username: string;
    email: string;
    password: string; // Stored as plain text
    role: 'user' | 'admin'; 
    createdAt: Date;
    updatedAt: Date;
}