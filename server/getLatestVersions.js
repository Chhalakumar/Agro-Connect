const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageNames = [
  "almond",
  "cashew",
  "jaggery",
  "sugar",
  "turmeric",
  "chilli",
  "moongDal",
  "toorDal",
];

async function getLatestVersions() {
  console.log("🔍 Fetching latest image versions from Cloudinary...\n");

  for (const imageName of imageNames) {
    try {
      const result = await cloudinary.api.resource(
        `AgroConnect/products/${imageName}`,
        { resource_type: "image" }
      );

      console.log(`✅ ${imageName}.jpg`);
      console.log(`   Version: ${result.version}`);
      console.log(`   URL: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Error fetching ${imageName}:`, error.message, "\n");
    }
  }

  console.log("\n📋 Copy these URLs to update seedDatabase.js");
}

getLatestVersions();
