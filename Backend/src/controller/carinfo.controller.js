import asyncHandler from "../utils/AsyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 import { uploadOncloudinary,deleteOnCloudinary } from "../utils/Cloudinary.js";
 import { User}  from "../models/user.model.js";
 import {  Car } from "../models/carinfo.model.js";

 const Addcar= asyncHandler(async(req,res)=>{
    const currentuser=req.user

    if(!currentuser)
    {
        throw new ApiError(400,"User is Not Logged In")
    }

    if(currentuser.role!=="seller")
    {
        throw new ApiError(400,"You Don't Have The permission to Add cars")
    }

    const{maker,model,year,price,milage,fuelType,color,bodyType,description,transmission}=req.body

    if (
    !maker || !model || !fuelType || !bodyType || !description || !transmission || !year || !price || !color || !milage ) {
    throw new ApiError(400, "All Fields Are Required");
}
   const sellerdetails= await User.findById(currentuser._id).select("username fullname address phoneno ")
    const files = req.files;

    //console.log("FILES RECEIVED:", req.files);

    if(!files || files.length === 0)
    {
        throw new ApiError(400,"Atleat 1 image Reqired")
    }

    const imageUrls = [];
    for (const file of files) {
        const url = await uploadOncloudinary(file.path);
        if (url) imageUrls.push(url);
    }
    if(imageUrls.length === 0) {
        throw new ApiError(400,"Problem in the upload images")
    }
  const car=new Car({
    maker,
    model,
    year,
    price,
    milage,
    fuelType,
    color,
    bodyType,
    description,
    transmission,
    images: imageUrls,
    seller: sellerdetails._id
  })
  const newCar= await Car.create(car)
  const cardetails=await Car.findById(newCar._id).populate("seller","username email phoneno address")
return res.
       status(200).
       json(new ApiResponse(200,cardetails,"Car Is Added"))


 })

const updatecarinfo = asyncHandler(async (req, res) => {
  const {
    maker, model, year, price, milage, fuelType, color, bodyType, description, transmission
  } = req.body;
  const updateFields = {};
  const carId = req.params.id;

  if (maker) updateFields.maker = maker;
  if (model) updateFields.model = model;
  if (year) updateFields.year = year;
  if (price) updateFields.price = price;
  if (milage) updateFields.milage = milage;
  if (fuelType) updateFields.fuelType = fuelType;
  if (color) updateFields.color = color;
  if (bodyType) updateFields.bodyType = bodyType;
  if (description) updateFields.description = description;
  if (transmission) updateFields.transmission = transmission;

  // Handle images
  const files = req.files;
  if (files && files.length > 0) {
    // Optionally: delete old images from Cloudinary here if you want to replace them
    const imageUrls = [];
    for (const file of files) {
      const url = await uploadOncloudinary(file.path);
      if (url) imageUrls.push(url);
    }
    updateFields.images = imageUrls;
  }

  const updatedcar = await Car.findByIdAndUpdate(carId, updateFields, { new: true, runValidators: true });

  if (!updatedcar) {
    throw new ApiError(400, "Car Not Found");
  }

  return res.status(200).json(new ApiResponse(200, updatedcar, "Car Details Successfully Updated"));
});

const deletecar=asyncHandler(async(req,res)=>{
    const carId=req.params.id
    const car= await Car.findById(carId)
    if (!car) {
        throw new ApiError(400,"Car Not Found")
    }
    
    let allDeleted = true;
    if (Array.isArray(car.images)) {
        for (const imageUrl of car.images) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            try {
                await deleteOnCloudinary(publicId);
            } catch (e) {
                allDeleted = false;
            }
        }
    } else if (typeof car.images === 'string') {
        const publicId = car.images.split('/').pop().split('.')[0];
        try {
            await deleteOnCloudinary(publicId);
        } catch (e) {
            allDeleted = false;
        }
    }
    const deletedcar= await Car.findByIdAndDelete(carId)
    if(!deletedcar)
    {
        throw new ApiError(400,"Problem In Delete The Car")
    }
    if (!allDeleted) {
        return res.status(200).json(new ApiResponse(200, "", "Car deleted, but some images may not have been removed from Cloudinary"));
    }
    return res.status(200).
            json(new ApiResponse(200,"","Car Deleted SucesFully"))
})

const getallcars=asyncHandler(async(req,res)=>{
    const cars= await Car.find({}).populate("seller","username email phoneno")
    if(!cars)
    {
        throw new ApiError(400,"No Cars Are Present")
    }

    return res.status(200).
          json(new ApiResponse(200,cars,"all cars Fetch Sucessfully"))
})

const getcar=asyncHandler(async(req,res)=>{
   const carId=req.params.id
   
   const car=await Car.findById(carId).populate("seller","username email phoneno address")
   if(!car)
   {
    throw new ApiError(400,"Error Whilw fetching Car") 
   }

   return res.status(200).
            json(new ApiResponse(200,car,"car Fetch Sucessfully"))

})

 export {Addcar,updatecarinfo,deletecar,getallcars,getcar}

