require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use sugar image as fallback for jaggery
cloudinary.uploader.upload(
  "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748227/AgroConnect/products/sugar.jpg",
  {
    folder: "AgroConnect/products",
    public_id: "jaggery",
    overwrite: true,
  },
  (error, result) => {
    if (result) {
      console.log("✅ Jaggery:", result.secure_url);
    } else {
      console.error("❌ Error:", error.message);
    }
  }
);
