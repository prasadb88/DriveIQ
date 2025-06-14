import mongoose from 'mongoose';
import { Db_name } from '../constant.js';



const connectDB = async () => {
    try{
        const response= await mongoose.connect(`${process.env.DATABASE_URL}/${Db_name}`)
        console.log("DATABSE Sucessfully Connected")
        console.log(response.connection.host);
       }

    catch(err){
        console.log("Connection Failed to Databse",err);
        process.exit(1)
    }
}

export default connectDB