import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"
import { ApiError } from './ApiError.js'

cloudinary.config({
    cloud_name:process.env.CLOUDNARY_NAME,
    api_key:process.env.CLOUDNARY_KEY,
    api_secret:process.env.CLOUDNARY_SECRET
})


const safeUnlinkSync = (path) => {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err; // Ignore file-not-found, rethrow others
    }
};

const uploadOncloudinary=async(localpath)=>{
    try {
   if(!localpath) {
    throw ApiError(400,"porblem in file upolad")
   }

   const response = await cloudinary.uploader.upload(localpath,{
        resource_type:"auto"
    })
   // console.log("File upolad sucessfully",response.url);
    safeUnlinkSync(localpath)
    return response.url
    
    } catch (error) {
        safeUnlinkSync(localpath)
        console.log("Error in file upload",error);
        
    }
}
const  deleteOnCloudinary=async(filepath)=>
{
    cloudinary.uploader.destroy(filepath);
}

export {uploadOncloudinary,deleteOnCloudinary}