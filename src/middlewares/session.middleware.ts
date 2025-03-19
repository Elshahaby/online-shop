
import session from 'express-session';
import { RequestHandler } from 'express';
import { sessionConfig } from '../config/session.config';


const sessionMiddleware: RequestHandler = session(sessionConfig);

export default sessionMiddleware;
