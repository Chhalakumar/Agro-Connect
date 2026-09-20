const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary configuration
const testCloudinaryConfig = () => {
  console.log("📸 Cloudinary Configuration:");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT SET");
  console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ NOT SET");
  console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ SET (hidden)" : "❌ NOT SET");
  console.log("");
};

const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: "AgroConnect",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          reject(error);
        } else {
          console.log("✅ Image uploaded successfully to Cloudinary");
          console.log("📷 URL:", result.secure_url);
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = {
  uploadImageToCloudinary,
  testCloudinaryConfig,
};
