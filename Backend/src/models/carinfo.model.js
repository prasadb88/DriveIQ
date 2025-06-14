import mongoose from "mongoose";
import { User } from "./user.model.js";

const CarSchema= new mongoose.Schema({
   seller:{
    type:mongoose.Schema.Types.ObjectId,
     ref:User
   },
   maker:{
    type:String,
    required:true
   },
   model:{
    type:String,
    required:true
   },
   year:{
    type:Number,
    required:true
   },
   price:{
    type:Number,
    required:true
   },
   milage:{
    type:Number,
    required:true
},
   fuelType:{
    type:String,
    required:true
   },
   color:{
    type:String,
    required:true
   },
   bodyType:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   }, 
   images:{
    type:[String],
    required:true
   },
   transmission:{
    type:String,
    required:true
   },
   isTestDriving: {
        type: Boolean,
        default: false 
    }

},{timestamps:true})

export const Car= mongoose.model("Car",CarSchema)