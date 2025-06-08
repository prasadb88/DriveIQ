import dotenv from 'dotenv'
dotenv.config({path:"./env"});
import app from "./app.js";
import connectDB from "./db/db.js";

connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is Running on Port ${process.env.PORT}`);
    })
    app.on('error',(err)=>{
        console.log("Error in server",err);
    })
    }).catch((err)=>{
      console.log("Error to Start the server",err);
     }
         )