require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productImages = {
  rice1: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80",
  rice2: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1200&q=80",
  wheat1: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
  wheat2: "https://images.unsplash.com/photo-1628108524317-b2e2a2c6d05a?w=1200&q=80",
  tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200&q=80",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1200&q=80",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1200&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=1200&q=80",
  chilli: "https://images.unsplash.com/photo-1583327290992-e834e8e6e8ed?w=1200&q=80",
  turmeric: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&q=80",
  toorDal: "https://images.unsplash.com/photo-1596097635594-040b8df5e21d?w=1200&q=80",
  moongDal: "https://images.unsplash.com/photo-1596098386197-0f0986f69267?w=1200&q=80",
  cashew: "https://images.unsplash.com/photo-1578742845125-c6b8b09f8a1c?w=1200&q=80",
  almond: "https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=1200&q=80",
  sugar: "https://images.unsplash.com/photo-1582134274919-81d0df6f6097?w=1200&q=80",
  jaggery: "https://images.unsplash.com/photo-1606312755580-641b67ec0a0a?w=1200&q=80",
};

const uploadImages = async () => {
  console.log("🌟 Starting Cloudinary upload...\n");
  
  const results = {};
  
  for (const [key, url] of Object.entries(productImages)) {
    try {
      console.log(`Uploading ${key}...`);
      const result = await cloudinary.uploader.upload(url, {
        folder: "AgroConnect/products",
        public_id: key,
        overwrite: true,
      });
      results[key] = result.secure_url;
      console.log(`✅ ${key} uploaded`);
    } catch (error) {
      console.error(`❌ ${key} failed:`, error.message);
    }
  }
  
  console.log("\n📋 Cloudinary URLs:\n", JSON.stringify(results, null, 2));
  return results;
};

uploadImages().then(() => console.log("\n✨ Done!")).catch(console.error);
