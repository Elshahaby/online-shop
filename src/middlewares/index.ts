import sessionMiddleware from './session.middleware';
import { flashMiddleware, flahsLocalMiddleware } from './flash.middleware';
import { cartMiddleware } from './cart.middleware';

export default [sessionMiddleware, flashMiddleware, flahsLocalMiddleware, cartMiddleware];