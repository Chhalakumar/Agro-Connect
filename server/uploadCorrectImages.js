const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// High-quality Pexels images for each product
const imagesToUpload = [
  {
    name: "almond",
    url: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Raw almonds"
  },
  {
    name: "cashew",
    url: "https://images.pexels.com/photos/6419720/pexels-photo-6419720.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Cashew nuts"
  },
  {
    name: "jaggery",
    url: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Organic jaggery blocks"
  },
  {
    name: "sugar",
    url: "https://images.pexels.com/photos/6544378/pexels-photo-6544378.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "White crystal sugar"
  },
  {
    name: "turmeric",
    url: "https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Turmeric powder"
  },
  {
    name: "chilli",
    url: "https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Red chilli powder"
  },
  {
    name: "moongDal",
    url: "https://images.pexels.com/photos/4033325/pexels-photo-4033325.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Moong dal green gram"
  },
  {
    name: "toorDal",
    url: "https://images.pexels.com/photos/5560060/pexels-photo-5560060.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Toor dal pigeon peas"
  },
];

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function uploadToCloudinary(filepath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: "AgroConnect/products",
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error(`Error uploading ${publicId}:`, error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting image download and upload process...\n");

  // Create temp directory
  const tempDir = path.join(__dirname, "temp_images");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  for (const image of imagesToUpload) {
    try {
      console.log(`📥 Downloading ${image.description}...`);
      const filepath = path.join(tempDir, `${image.name}.jpg`);
      
      await downloadImage(image.url, filepath);
      console.log(`✅ Downloaded ${image.name}.jpg`);

      console.log(`☁️  Uploading to Cloudinary...`);
      const result = await uploadToCloudinary(filepath, image.name);
      console.log(`✅ Uploaded: ${result.secure_url}`);
      console.log(`   Version: ${result.version}\n`);

      // Clean up temp file
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error(`❌ Error processing ${image.name}:`, error.message);
    }
  }

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir);
  }

  console.log("\n🎉 All images uploaded successfully!");
  console.log("\n📋 Update these URLs in seedDatabase.js:");
  console.log("Replace the existing Cloudinary URLs with the new version numbers from above.");
}

main();
