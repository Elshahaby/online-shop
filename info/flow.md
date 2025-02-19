
# 1. setup project configuration

### `Environment Variables`

- using `dotenv` cofig.env to store sensitive data like MongoDB connection string and session secrets 

### `session, flash and Multer configurarion`

- set up `express-session` with `connect-mongo` to store sessions in MongoDB
- set up `connect-flash` to Display success/error messages
- Configure Multer to handle file uploads like product images.


---

# 2. Structure My Mongoose Models

### `Define TypeScript Interfaces`
 
- Define Typescript interfaces before creating Mongoose Models to represent the structure of your documents. 
- This ensures type safety and make the code more readable.
- I do this at types folder

### `Create Mongoose Schemas` 

- Using the interfaces, define mongoose schemas.
- Schemas are used to enforce the structure of documents in MongoDB.
- I do this at models folder.

--- 

#  