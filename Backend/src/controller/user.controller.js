import asyncHandler from "../utils/AsyncHandler.js";

    import {ApiError} from "../utils/ApiError.js"

    import {ApiResponse} from "../utils/ApiResponse.js"

    import { User } from "../models/user.model.js";

    import { deleteOnCloudinary, uploadOncloudinary } from "../utils/Cloudinary.js";
    import jwt from "jsonwebtoken"
   
   const genraterefreshtokenacesstoken = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const refreshtoken = await user.genrateRefreshtoken();
    const accesstoken = await user.genrateAccesstoken();
    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { refreshtoken, accesstoken };
};

    const registeruser = asyncHandler(async (req, res) => {

    const { username, password, fullname, email, address, phoneno, role } = req.body;

    if (username === "" || password === "" || fullname === "" || email === "" || address === "" || phoneno === "") {

    throw new ApiError(400, "All Fields Required")
    }
    const regexemail=/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm



    if(!regexemail.test(email)){

    throw new ApiError(400, "Invalid email");

    }

    const passwordregex = /^(?=.*[\W_]).{8,}$/;

    if(!passwordregex.test(password)){

    throw new ApiError(400, "Password must be 8 characters long and contain a special character");

    }

    if (await User.findOne({

    $or:[

    {username},

    {email},
    {phoneno}

    ]

    }))
    

    {

    throw new ApiError(400,"User Alredy Exist")

    }
     let avatar
      const avatarlocal= req.file?.path;

      if(avatarlocal)
      {
     avatar = await uploadOncloudinary(avatarlocal)
      }
      else
      {
        avatar="https://res.cloudinary.com/doasllkyt/image/upload/v1749456578/qgmp5sbgq43tys0bwied.png"
      }
    if (!avatar) {

    throw new ApiError(400, "Failed to upload avatar")

    }



    const user = new User({

    username,

    password,

    email,

    phoneno,

    address,

    role,

    fullname,

    avatar

    })

    const newUser=await User.create(user);



    const createduser=await User.findById(user._id).select("-password ");



    res.status(201).json(

    new ApiResponse(201,createduser, "User created successfully")
    )
    })
 

     const login = asyncHandler(async(req,res)=>{
      const {username,email,password}=req.body;
      if(!username && !email)
      {
        throw new ApiError(400,"Please enter the Username or email")
      }

      const user = await User.findOne({
        $or:[
          {username},
          {email}
        ]
      });
      if(!user)
      {
        throw new ApiError(400,"Invaild Credinatial")
      }
      const ispasswordcorrect = await user.isPasswordCorrect(password);
      if(!ispasswordcorrect)
      {
        throw new ApiError(400,"Invalid Password")
      }
      const {refreshtoken,accesstoken} = await genraterefreshtokenacesstoken(user._id);
      const loggedinuser = await User.findById(user._id).select("-password -refreshtoken");
      const option={
        httpOnly:true,
        secure:true
      }

      return res.
        status(200).
        cookie("refreshtoken",refreshtoken,option).
        cookie("accesstoken",accesstoken,option).
        json(
          new ApiResponse(200, {user: accesstoken,refreshtoken,loggedinuser }, "User logged in successfully")
        );
});

const logout=asyncHandler(async(req,res)=>{
  const user=req.user
    
    await User.findByIdAndUpdate(user._id,{
      $set:{
        refreshtoken:undefined
      }
    },{
      new:true
    })
    const option={
        httpOnly:true,
        secure:true
      }

    return res.
    status(200).
    clearCookie("accesstoken", option).
    clearCookie("refreshtoken", option).
    json(new ApiResponse(200,{},"logout sucessfully"))
})

const genratenewtoken= asyncHandler(async(req,res)=>{
  const oldtoken = req.cookies?.refreshtoken || req.body?.accesstoken

  if(!oldtoken)
  {
    throw new ApiError(401,"please Login Agian")
  }
  const decodedtoken= jwt.verify(oldtoken,process.env.REFRESH_SECRET)
  console.log(decodedtoken.id);
  
  const user= await User.findById(decodedtoken.id)
  if(!user)
  {
    throw new ApiError(401,"User not Found")
  }

  if(oldtoken !== user.refreshtoken)
  {
    throw new ApiError(401,"Refresh code is Invalid")
  }
  const {refreshtoken,accesstoken}= await genraterefreshtokenacesstoken(decodedtoken.id)

  await User.findByIdAndUpdate(decodedtoken.id,{
    $set:{
      refreshtoken:refreshtoken
    }
  },{
    new:true
  })
  const option={
        httpOnly:true,
        secure:true
      }

   return res.
        status(200).
        cookie("refreshtoken",refreshtoken,option).
        cookie("accesstoken",accesstoken,option).
        json(
          new ApiResponse(200, {user: accesstoken,refreshtoken }, "New Tokens Genrate Sucessfully ")
        );
  
})

const changepassword= asyncHandler(async (req,res)=>{

 const {newpass,oldpass}=req.body
 const currentuser= await User.findById(req.user.id)
 
 if(!currentuser)
 {
  throw new ApiError(401,'user not logged in')
 }

 const passwordcorrect=await currentuser.isPasswordCorrect(oldpass)

 if(!passwordcorrect)
 {
  throw new ApiError(401,"Password Is Incorrect")
 }

 currentuser.password = newpass;
 await currentuser.save();

  return res.
   status(200).
   json(new ApiResponse(200,"Password is changed"))
})

const getcurrentuser=asyncHandler(async(req,res)=>{
  const currentuser=await User.findById(req.user._id).select("-password -refreshtoken")

  if(!currentuser)
  {
    throw new ApiError(401,"Can'not get the user")
  }
  return res.
       status(200).
       json(new ApiResponse(200,currentuser,"User Fetch Sucessfully"))
})

const changeaccountdetails = asyncHandler(async (req, res) => {
  const { username, email, phoneno, address } = req.body;

  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (phoneno) updateFields.phoneno = phoneno;
  if (address) updateFields.address = address;


  const updatedUser = await User.findByIdAndUpdate( 
    req.user._id,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshtoken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});
  

 const updateAvatar =asyncHandler(async(req,res)=>{
  const avatarlocal = req.file?.path;
  const user = await User.findById(req.user._id)

  const oldavatar = user.avatar;

  if(!avatarlocal)
  {
    throw new ApiError(400,"Faield to Upload Avatar")
  }
  const newavatar = await uploadOncloudinary(avatarlocal)

  if(!newavatar)
  {
     throw new ApiError(400,"Faield to Upload Avatar")
  }
  user.avatar = newavatar;
  if(oldavatar)
  {
    const publicId = oldavatar.split('/').pop().split('.')[0];
    await deleteOnCloudinary(publicId);
  }
  await user.save({ validateBeforeSave: false });

  return res.
    status(200).
    json(new ApiResponse(200, newavatar, "Avtar Changed sucessfully"))
 })

const chagerole= asyncHandler(async(req,res)=>{
  const{role}=req.body
  const user=req.user
  if(!user)
  {
    throw new ApiError(400,"User is not Logged in")
  }
  await User.findByIdAndUpdate(user._id,{
    $set:{
      role:role
    }
  },{
    new:true
  })

  return res.
  status(200).
  json(new ApiResponse(200,"Role Is Changed Sucessfully"))

})



    export {registeruser,login,logout,genratenewtoken,changepassword,getcurrentuser,changeaccountdetails,updateAvatar,chagerole}