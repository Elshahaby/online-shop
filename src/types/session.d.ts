import 'express-session';   

declare module 'express-session' {
  interface Session {
    user?: {id?: string, username: string, role: string} | null;
    isAdmin?: boolean; 
    cart?: string | number [{
      title: string; 
      slug: string;
      quantity: number;
      price: number;
      image: string;
    }]; 
    formData?: { [key: string]: any } | null; // Allows storing form data  
  }
}