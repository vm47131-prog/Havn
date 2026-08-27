const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Cloudinary Credentials Configuration
cloudinary.config({
  //cloud_name,api_key,api_secret=> by default these names are given to config
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// 2. Setting up CloudinaryStorage with Dynamic Parameters
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV", // Saves all images in a folder named 'wanderlust_DEV'
    allowedFormats: ["png", "jpg", "jpeg"], //image uploaded in the given format
  },
});
module.exports = {
  cloudinary,
  storage,
};
