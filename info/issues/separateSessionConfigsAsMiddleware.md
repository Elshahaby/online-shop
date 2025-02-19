### Setup Issue

I will just talk about this issue, it is my first time separate the set up of session configs in a middleware.

my error handling makes me found that the environment variables is not loaded in session.middleware.ts (src/middlewares/session.middleware.ts), by log this message in console
```powershell
D:\programming\full_stack\back_end\Node.js\projects\online shop\src\middlewares\session.middleware.ts:16
    throw new Error('SESSION_SECRET is not defined');
          ^

Error: SESSION_SECRET is not defined
```

---

 #### Code before debugging at `sesstion.middleware.ts` file

**`src/middlewares/session.middleware.ts` At error and Before Fix and debugging**
 ```ts
import session from 'express-session';
import MongoStore from 'connect-mongo'
import { RequestHandler } from 'express';

const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URL;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined');
}
if(!mongoUri){
    throw new Error('Data Base URL is Not Found');
}
// rest of the file
 ```

---

#### Trying To Debugg

<br>

When I am debugging in that file (session.middleware.ts) using 
`console.log('SESSION_SECRET in sessionMiddleware:', process.env.SESSION_SECRET);` 
and `console.log('MONGO_URL in sessionMiddleware:', process.env.MONGO_URL);` like this

```ts

import session from 'express-session';
import MongoStore from 'connect-mongo'
import { RequestHandler } from 'express';


// for debugging purpose
console.log('SESSION_SECRET in sessionMiddleware:', process.env.SESSION_SECRET);
console.log('MONGO_URL in sessionMiddleware:', process.env.MONGO_URL);


const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URL;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined');
}
if(!mongoUri){
    throw new Error('Data Base URL is Not Found');
}
// rest of the code
```

**Output in terminal is:**
```plaintext
SESSION_SECRET in sessionMiddleware: undefined
MONGO_URL in sessionMiddleware: undefined

D:\programming\full_stack\back_end\Node.js\projects\online shop\src\middlewares\session.middleware.ts:16
    throw new Error('SESSION_SECRET is not defined');
          ^


Error: SESSION_SECRET is not defined
```

- So, I am be sure that the environment variables not actually loaded in that file

---

Although, I setup the `dotenv` package and upload the environment variables by using `dontenv.config({path: })` in my `app.ts` file.

**`src/app.ts` file**
```ts
import dotenv,{config} from 'dotenv';
import path from "path" 
import express,{Request, Response,NextFunction} from "express"
import mongoose from 'mongoose'
import sessionMiddleware from './middlewares/session.middleware';
import {flahsLocalMiddleware, flashMiddleware} from './middlewares/flash.middleware';
import authRoutes from './routes/auth.route'

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

// not log anything in the console right now because of the error
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('MONGO_URL:', process.env.PORT);

const app = express();


const port = process.env.PORT || 5000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'..','public')));

app.use(sessionMiddleware);
app.use(flashMiddleware);
app.use(flahsLocalMiddleware);
// there is a rest of code 
```

- As I know, when you upload Environment Variables in your `app.ts` all Environment Variables stores in your `config.env` file will be global in your project not just in your `app.ts` file
- But, I found that I am wrong

---

### How I found that I am wrong??? Like I Said at the previous phrase.

- First, I comment the middlewares that actually from `session.middleware.ts` file

**`src/app.ts` file**
```ts
import dotenv,{config} from 'dotenv';
import path from "path" 
import express,{Request, Response,NextFunction} from "express"
import mongoose from 'mongoose'
import sessionMiddleware from './middlewares/session.middleware';
import {flahsLocalMiddleware, flashMiddleware} from './middlewares/flash.middleware';
import authRoutes from './routes/auth.route'

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

// will work after I comment the mentioned middlewares and logs output not error in console
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('MONGO_URL:', process.env.PORT);

const app = express();

const port = process.env.PORT || 5000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'..','public')));

// app.use(sessionMiddleware);
// app.use(flashMiddleware);
// app.use(flahsLocalMiddleware);
// there is a rest of code 
```

- After I comment the middlewares `app.use(sessionMiddleware)` and  `app.use(flashMiddleware)` and `flahsLocalMiddleware` as they depend on session setup in `session.middleware.ts` file, this output shows in the console:
```console
SESSION_SECRET: takecarejustlowercaseletters
MONGO_URL: mongodb+srv://Elshahaby:KUBrgQyLy36_LGs@learn-mongodb.zbvwf.mongodb.net/onlineShop?retryWrites=true&w=majority&appName=learn-mongodb
MONGO_URL: 3000
Server is running on http://localhost:3000
```

- That means that the Environment Variables are loaded in `app.ts` file and all is fine at that file, and we double **confirmed** that **There is an issue at uploading Environment Variables at `session.middleware.ts` File**

- Finally, I found that I am actually Wrong

---

## So, I Will Try To Manually Load `.env` in `session.middleware.ts` File.

- Since `session.middleware.ts` is a separate file, `dotenv` might not be loaded when it's accessed. Try explicitly loading it inside `session.middleware.ts`:

```ts
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import { RequestHandler } from 'express';

dotenv.config({ path: path.resolve(__dirname, '../../config.env') });

// for debugging purpose
console.log('SESSION_SECRET in sessionMiddleware:', process.env.SESSION_SECRET);
console.log('MONGO_URL in sessionMiddleware:', process.env.MONGO_URL);

const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URL;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined');
}
if(!mongoUri){
    throw new Error('Data Base URL is Not Found');
}
```

- After remove the debugging consoles in `app.ts` and Manually Load the `.env` in `session.middleware.ts` by using `import dotenv from 'dotenv';` and `import path from 'path';` and `dotenv.config({ path: path.resolve(__dirname, '../../config.env') });` 
- Finally, the code works and the `console.log` used for debugging works too

**OutPut in Terminal is:**

```terminal
SESSION_SECRET in sessionMiddleware: takecarejustlowercaseletters

MONGO_URL in sessionMiddleware: mongodb+srv://Elshahaby:KUBrgQyLy36_LGs@learn-mongodb.zbvwf.mongodb.net/onlineShop?retryWrites=true&w=majority&appName=learn-mongodb

Server is running on http://localhost:3000
```

---

