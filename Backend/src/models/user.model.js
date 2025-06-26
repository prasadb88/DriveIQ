import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    required: true,
    type: String
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer',

    },
  fullname: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
  },
  // avatar: {
  //   type: String,
  //   required: true,
  //   default:"https://res.cloudinary.com/doasllkyt/image/upload/v1749456578/qgmp5sbgq43tys0bwied.png"
  // },
  refreshtoken: {
    type: String,
    
  }
}, { timestamps: true })

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password, 8);
    }
    next();
});

UserSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.genrateAccesstoken=async function(){
    return jwt.sign({
        id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname
    },process.env.ACESSTOKEN_SECRET,{expiresIn:process.env.ACESSTOKEN_EXPIRY})
}

UserSchema.methods.genrateRefreshtoken= async function(){
    return jwt.sign({
        id:this._id
    },process.env.REFRESH_SECRET,{expiresIn:process.env.REFRESH_EXPIRY})
}


export const User= mongoose.model("User",UserSchema)