require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const remainingImages = {
  wheat2: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  chilli: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=1200&q=80",
  toorDal: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=1200&q=80",
  moongDal: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&q=80",
  cashew: "https://images.unsplash.com/photo-1590334812775-5a442d0bc05d?w=1200&q=80",
  sugar: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=1200&q=80",
  jaggery: "https://images.unsplash.com/photo-1590931151119-b996b4122c90?w=1200&q=80",
};

const upload = async () => {
  const results = {};
  for (const [key, url] of Object.entries(remainingImages)) {
    try {
      console.log(`Uploading ${key}...`);
      const result = await cloudinary.uploader.upload(url, {
        folder: "AgroConnect/products",
        public_id: key,
        overwrite: true,
      });
      results[key] = result.secure_url;
      console.log(`✅ ${key}`);
    } catch (error) {
      console.error(`❌ ${key}:`, error.message);
    }
  }
  console.log("\n", JSON.stringify(results, null, 2));
};

upload();
