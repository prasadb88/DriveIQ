import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDNARY_NAME,
    api_key:process.env.CLOUDNARY_KEY,
    api_secret:process.env.CLOUDNARY_SECRET
})


const uploadOncloudinary=async(localpath)=>{
    try {
   if(!localpath) return null
   const response = await cloudinary.uploader.upload(localpath,{
        resource_type:"auto"
    })
    console.log("File upolad sucessfully",response.url);
    fs.unlink(localpath)
    return response
    
    } catch (error) {
        fs.unlinkSync(localpath)
        console.log("Error in file upload",error);
        
    }
}

export {uploadOncloudinary}