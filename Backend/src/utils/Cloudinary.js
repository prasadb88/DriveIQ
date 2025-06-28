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
        if (path && fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error("Error deleting file:", err);
        }
    }
};

const uploadOncloudinary=async(localpath)=>{
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDNARY_NAME || !process.env.CLOUDNARY_KEY || !process.env.CLOUDNARY_SECRET) {
            throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
        }

        if(!localpath) {
            throw new Error("File path is required for upload");
        }

        // Check if file exists
        if (!fs.existsSync(localpath)) {
            throw new Error("File does not exist at the specified path");
        }

        const response = await cloudinary.uploader.upload(localpath,{
            resource_type:"auto"
        })
        
        console.log("File uploaded successfully:", response.url);
        safeUnlinkSync(localpath)
        return response.url
        
    } catch (error) {
        safeUnlinkSync(localpath)
        console.error("Error in file upload:", error);
        
        // Provide more specific error messages
        if (error.message.includes("Cloudinary configuration")) {
            throw new Error("Cloudinary is not properly configured. Please check your environment variables.");
        }
        
        if (error.http_code) {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
        
        throw new Error(`File upload failed: ${error.message}`);
    }
}

const  deleteOnCloudinary=async(filepath)=>
{
    try {
        if (!process.env.CLOUDNARY_NAME || !process.env.CLOUDNARY_KEY || !process.env.CLOUDNARY_SECRET) {
            throw new Error("Cloudinary configuration is missing");
        }
        
        const result = await cloudinary.uploader.destroy(filepath);
        console.log("File deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
    }
}

export {uploadOncloudinary,deleteOnCloudinary}