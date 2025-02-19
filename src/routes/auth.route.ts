import express,{Request, Response} from 'express'
import {getSignUp, postSignUp} from '../controllers/auth.controller'
import { getLogin, postLogin } from '../controllers/auth.controller';
import { errorHandlerFunction } from '../middlewares/errorHandlerFunction.middleware';
import {User} from '../models'

const router = express.Router();


router.get('/signup', getSignUp);

router.post('/signup', postSignUp);

router.get('/login' , getLogin);

router.post('/login', postLogin);

router.get('/logout', (req: Request, res: Response) => {
    //  removes the session data from the session store like MongoDB
    try{
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                throw new Error('Could not log out. Please try again. Could not destroy session');
            }

            // remove the session cookie (connect.sid) from user's browser
            res.clearCookie('connect.sid'); // 'connect.sid' is the default session cookie name

            // as I destroy my session, I can't use req.flash as it depends on sessions 
            // so I pass the message as query in the url request
            res.redirect('/auth/login?message=You have been Logged out. Log In for continue');
        })
    }catch(error){
        // want to show the error flash message in the same route I stand on  ????? how to pass my route to req
        errorHandlerFunction('/')(error, req, res, () => {})
    }
})

export default router;