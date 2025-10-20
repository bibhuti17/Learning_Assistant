import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (filePath) => {

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(filePath)
        fs.unlinkSync(filePath) // remove file from server after upload
        return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filePath) // remove file from server after upload
        return res.status(500).json({ message: "Cloudinary upload error" })
    }
}

export default uploadOnCloudinary