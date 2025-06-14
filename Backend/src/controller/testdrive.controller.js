import asyncHandler from "../utils/AsyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 import { TestDrive } from "../models/testdrive.model.js";
import { Car } from "../models/carinfo.model.js";
import { User } from "../models/user.model.js";

const requesttestdrive=asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id || req.user).select("username email fullname phoneno")
    const{carId,requestedtime}=req.body
    if(!user)
    {
        throw new ApiError(400,"User Not Found")
    }
    if(!carId)
    {
        throw new ApiError(400,"Car Not Found")
    }
    const car = await Car.findById(carId)
    if (!car) {
        throw new ApiError(400, "Car Not Found")
    }
    if (!car.seller) {
        throw new ApiError(400, "Test drive must be associated with a seller")
    }
    const testdrive= await TestDrive.create({
        car:carId,
        buyer:user._id,
        seller:car.seller,
        requestedTime:requestedtime,
        status:"pending"
    })
    return res.status(200).
       json(new ApiResponse(200,testdrive,"Request Send To the the Seller"))
})
   
const mytestdriverequest= asyncHandler(async(req,res)=>{
      const user=req.user
    const requests = await TestDrive.find({ buyer: user._id })
        .populate('car', 'maker model year')
        .populate('seller', 'username email fullname');

    return res.status(200).
        json(new ApiResponse(200, requests, "request feature sucessfully"))
})

const getSellerTestDriveRequests = asyncHandler(async (req, res) => {
    const user=req.user


    const requests = await TestDrive.find({ seller:user._id  })
        .populate('car', 'maker model year color') 
        .populate('seller', 'name email phone') 
        .sort({ createdAt: -1 }); 

    res.status(200).json(new ApiResponse(200,requests,"request feature sucessfully"));
});

const accepttestdrive= asyncHandler(async(req,res)=>{
    const {id}=req.params
    const {confirmedTime}= req.body
    
    const testdrive= await TestDrive.findById(id)

    if(!testdrive)
    {
     throw new ApiError(400,"Test Drive Request Not Found")
    }
    if(!confirmedTime)
    {
     throw new ApiError(400,"confirmedTime is required")
    }

    if(testdrive.status!=="pending")
    {
        throw new ApiResponse(400,"TestDrive Request is not pending")
    }
    testdrive.status="accepted"
    testdrive.confirmedTime=confirmedTime
    await testdrive.save({validateBeforeSave:false })

    return res.status(200).
      json(new ApiResponse(200,"","testDrive Aceppted Scessfully"))
})

  const rejectedtestdrive=asyncHandler(async(req,res)=>{
     const {id}=req.params
    const {message}= req.body

   const testdrive= await TestDrive.findById(id)

   if(!testdrive)
    {
     throw new ApiError(400,"Test Drive Request Not Found")
    }
    if(!message)
    {
     throw new ApiError(400,"message is required")
    }

    testdrive.rejectionReason=message
    testdrive.status="rejected"
    await testdrive.save({validateBeforeSave:false})

    return res.status(200).
      json(new ApiResponse(200,"","testDrive Rejected Scessfully"))

  })
 const starttestdrive= asyncHandler(async(req,res)=>{
     const {id}=req.params

     const testdrive=await TestDrive.findById(id)
  
   if(!testdrive)
    {
     throw new ApiError(400,"Test Drive Request Not Found")
    }

    if(testdrive.status!=="accepted")
    {
        throw new ApiError(400,"Test Drive Request Not Accepted")
    }

    testdrive.status=true
    await testdrive.save({validateBeforeSave:false})

    return res.status(200).
      json(new ApiResponse(200,"","testDrive Start Scessfully"))

 })

  const completetestdrive=asyncHandler(async(req,res)=>{
     const {id}=req.params

     const testdrive=await TestDrive.findById(id)
  
   if(!testdrive)
    {
     throw new ApiError(400,"Test Drive Request Not Found")
    }
     if(testdrive.status!=="accepted")
    {
        throw new ApiError(400,"Test Drive Request Not Accepted")
    }
    testdrive.status="completed"
    await testdrive.save({validateBeforeSave:false})

    return res.status(200).
      json(new ApiResponse(200,"","testDrive Start Scessfully"))

  })
  const cancelTestDrive = asyncHandler(async (req, res) => {
    const { id } = req.params; // TestDrive ID

    const testDrive = await TestDrive.findById(id);

    if (!testDrive) {
        res.status(404);
        throw new Error('Test Drive request not found.');
    }

    if (['completed', 'rejected'].includes(testDrive.status)) {
        res.status(400);
        throw new Error(`Test Drive request is already ${testDrive.status}. Cannot cancel.`);
    }

    
    const car = await Car.findById(testDrive.car);
    if (car && car.isTestDriving) {
        car.isTestDriving = false;
        await car.save();
    }
     testDrive.status="cancelled"
    await testDrive.save({validateBeforeSave:false})

    return res.status(200).
      json(new ApiResponse(200,"","testDrive cancelled Scessfully"))
})

    

export {requesttestdrive,mytestdriverequest,getSellerTestDriveRequests,accepttestdrive,cancelTestDrive,completetestdrive,starttestdrive,rejectedtestdrive}