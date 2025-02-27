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
        // validate request body
        const userInput: SignUp = signUpSchema.parse(req.body);
        const {username, email, password, role} = userInput;
        
        // check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          req.flash('errors', 'Email or username already exists, try another');
          return res.redirect('/auth/signup');
        }

        // create new user 
        const newUser = await User.create({ username, email, password, role });
        await newUser.save();

        // store user ID in session (adding custom properity to express-session (userId))
        req.session.userId = newUser._id.toString();
        
        req.flash('success', 'Sign Up successful !!')
        // after signup, send him to login || you could send him to homepage as logedin user (I will see that later).
        res.redirect('/auth/login');
    }catch(error){
        errorHandlerFunction('/auth/signup')(error, req, res, () => {});
    }
}


// login controllers

export const getLogin =  (req: Request, res:Response) => {
    res.render('login', { title: 'LogIn', query: req.query });
};

export const postLogin = async(req: Request, res: Response) => {
    try{
        // Validate request body
        const loginInput :Login = loginSchema.parse(req.body);
        const {email, password} = loginInput;

        // check if the user exist
        const user = await User.findOne({ email });
        if(!user || user.password !== password){
            req.flash('errors', 'Invalid email or password, try again or register if you don\'t have account');
            return res.redirect('/auth/login');
        }

        req.session.userId = user._id.toString();

        req.flash('success', 'LogIn Successful');
        res.redirect('/');

    }catch(error){
        errorHandlerFunction('/auth/login')(error, req, res, () => {});
    }
};

