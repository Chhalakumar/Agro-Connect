require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const finalImages = {
  cashew: "https://images.unsplash.com/photo-1508747703725-719777637510?w=1200&q=80",
  jaggery: "https://images.unsplash.com/photo-1590134352951-da83ea1de1f1?w=1200&q=80",
};

const upload = async () => {
  for (const [key, url] of Object.entries(finalImages)) {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: "AgroConnect/products",
        public_id: key,
        overwrite: true,
      });
      console.log(`✅ ${key}: ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ ${key}:`, error.message);
    }
  }
};

upload();
