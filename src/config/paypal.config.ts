import dotenv from 'dotenv';
import path from "path" 
import paypal from 'paypal-rest-sdk';

dotenv.config({ path: path.resolve(__dirname, './config.env') });

const paypalId = process.env.PAYPAL_ID;
const paypalSecret = process.env.PAYPAL_SECRET;

if(!paypalId){
    throw new Error('paypal Id not found!');
}
if(!paypalSecret){
    throw new Error('paypal secret not found!');
}

const paypalConfig ={
    mode: 'sandbox',
    client_id: paypalId,
    client_secret: paypalSecret
}

paypal.configure(paypalConfig);

export default paypal;