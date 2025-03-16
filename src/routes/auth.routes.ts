import express from 'express'
import {getLogout, getSignUp, postSignUp} from '../controllers/auth.controller'
import { getLogin, postLogin } from '../controllers/auth.controller';

const router = express.Router();


router.get('/signup', getSignUp);

router.post('/signup', postSignUp);

router.get('/login' , getLogin);

router.post('/login', postLogin);

router.get('/logout', getLogout)

export default router;