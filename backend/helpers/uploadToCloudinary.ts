import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
// End cloudinary

const streamUpload = (buffer: any) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (buffer: any) => {
  let result = await streamUpload(buffer);
  return result["url"];
}