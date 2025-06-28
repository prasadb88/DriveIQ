import asyncHandler from "../utils/AsyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 import { uploadOncloudinary,deleteOnCloudinary } from "../utils/Cloudinary.js";
 import { User}  from "../models/user.model.js";
 import {  Car } from "../models/carinfo.model.js";

 const Addcar= asyncHandler(async(req,res)=>{
    try {
        console.log("Addcar request received:", {
            user: req.user ? "User authenticated" : "No user",
            body: req.body,
            files: req.files ? req.files.length : 0
        });

        const currentuser=req.user

        if(!currentuser)
        {
            throw new ApiError(401,"User is Not Logged In")
        }

        if(currentuser.role!=="seller")
        {
            throw new ApiError(403,"You Don't Have The permission to Add cars")
        }

        const{maker,model,year,price,milage,fuelType,color,bodyType,description,transmission}=req.body

        // Validate required fields
        const requiredFields = {maker,model,year,price,milage,fuelType,color,bodyType,description,transmission};
        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.toString().trim() === '')
            .map(([key]) => key);

        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate numeric fields
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
            throw new ApiError(400, "Invalid year. Must be between 1900 and next year");
        }

        if (isNaN(price) || price <= 0) {
            throw new ApiError(400, "Invalid price. Must be a positive number");
        }

        if (isNaN(milage) || milage < 0) {
            throw new ApiError(400, "Invalid mileage. Must be a non-negative number");
        }

        console.log("Looking up seller details for user ID:", currentuser._id);
        const sellerdetails= await User.findById(currentuser._id).select("username fullname address phoneno ")
        
        if (!sellerdetails) {
            throw new ApiError(404, "Seller details not found");
        }

        const files = req.files;

        console.log("Files received:", files ? files.length : 0);

        if(!files || files.length === 0)
        {
            throw new ApiError(400,"At least 1 image is required")
        }

        if (files.length > 5) {
            throw new ApiError(400, "Maximum 5 images allowed");
        }

        console.log("Starting image upload to Cloudinary...");
        const imageUrls = [];
        for (const file of files) {
            try {
                console.log("Uploading file:", file.originalname);
                const url = await uploadOncloudinary(file.buffer, file.originalname);
                if (url) {
                    imageUrls.push(url);
                    console.log("File uploaded successfully:", url);
                } else {
                    console.error("Failed to get URL for file:", file.originalname);
                }
            } catch (uploadError) {
                console.error("Error uploading file:", file.originalname, uploadError);
                throw new ApiError(500, `Failed to upload image ${file.originalname}: ${uploadError.message}`);
            }
        }

        if(imageUrls.length === 0) {
            throw new ApiError(500,"Failed to upload any images")
        }

        const carData = {
            maker: maker.trim(),
            model: model.trim(),
            year: parseInt(year),
            price: parseFloat(price),
            milage: parseInt(milage),
            fuelType: fuelType.trim(),
            color: color.trim(),
            bodyType: bodyType.trim(),
            description: description.trim(),
            transmission: transmission.trim(),
            images: imageUrls,
            seller: sellerdetails._id
        };

        console.log("Creating car with data:", carData);

        const newCar= await Car.create(carData)
        
        if (!newCar) {
            throw new ApiError(500, "Failed to create car record");
        }

        const cardetails=await Car.findById(newCar._id).populate("seller","username email phoneno address")
        
        if (!cardetails) {
            throw new ApiError(500, "Failed to fetch created car details");
        }

        console.log("Car created successfully:", cardetails._id);

        return res.status(201).json(new ApiResponse(201, cardetails, "Car added successfully"));

    } catch (error) {
        console.error("Error in Addcar:", error);
        
        // If it's already an ApiError, rethrow it
        if (error instanceof ApiError) {
            throw error;
        }
        
        // Handle other errors
        throw new ApiError(500, `Failed to add car: ${error.message}`);
    }
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

