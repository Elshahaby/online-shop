import { Request, Response, NextFunction } from 'express';
import { signUpSchema, SignUp } from '../validators/auth.validator'
import { User } from '../models'
import { errorHandlerFunction } from '../middlewares/errorHandlerWithRedirection.middleware'
import { Login, loginSchema } from '../validators/auth.validator';



// signup controllers

export const getSignUp = (req: Request, res: Response) => {
    res.render('signup', { title: 'Sign Up' });
}

export const postSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const userInput: SignUp = signUpSchema.parse(req.body);
        const {username, email, password, role} = userInput;
        
        // check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          req.flash('errors', 'Email or username already exists, try another');
          return res.redirect('/auth/signup');
        }

        const newUser = await User.create({ username, email, password, role });
        await newUser.save();

        req.session.user = {id: newUser.id, username: newUser.username, role: "user"};
        
        req.flash('success', 'Sign Up successful !!')
        res.redirect('/auth/login');
    }catch(error){
        errorHandlerFunction('/auth/signup')(error, req, res, () => {});
    }
}


// login controllers

export const getLogin =  (req: Request, res:Response) => {
    if(req.session.user?.id){
        res.redirect('/');
        return;
    } 
    
    res.render('login', { title: 'LogIn'});
};

export const postLogin = async(req: Request, res: Response) => {
    try{

        const loginInput :Login = loginSchema.parse(req.body);
        const {email, password} = loginInput;

        const user = await User.findOne({ email });
        if(!user || user.password !== password){
            req.flash('errors', 'Invalid email or password, try again or register if you don\'t have account');
            return res.redirect('/auth/login');
        }

        req.session.user = {id: user.id, username: user.username, role: user.role};

        req.flash('success', 'LogIn Successful');
        res.redirect('/');

    }catch(error){
        errorHandlerFunction('/auth/login')(error, req, res, () => {});
    }
};

// logout
export const getLogout = (req: Request, res: Response) => {
    try{
        
        req.session.regenerate((err) => {
            if (err) {
                console.error('Error regenerating session:', err);
            }
                        
            req.session.user = null;  
            req.flash('success', 'You have been logged out successfully.');
            res.redirect('/auth/login');
        });

    }catch(error){
        errorHandlerFunction('/auth/login')(error, req, res, () => {})
    }
};