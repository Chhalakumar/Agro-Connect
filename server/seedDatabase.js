require("./config/connectDB.js");
const bcrypt = require("bcryptjs");
const User = require("./models/userSchema");
const Seller = require("./models/sellerSchema");
const Product = require("./models/productSchema");
const Order = require("./models/orderSchema");
const Review = require("./models/reviewSchema");
const FAQ = require("./models/faqSchema");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Seller.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await FAQ.deleteMany({});
    console.log("✅ Existing data cleared\n");

    // Hash password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create Users
    console.log("👥 Creating users...");
    const users = await User.insertMany([
      {
        name: "Rahul Kumar",
        contact: 9876543210,
        email: "rahul@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Priya Sharma",
        contact: 9876543211,
        email: "priya@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Amit Patel",
        contact: 9876543212,
        email: "amit@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Sneha Gupta",
        contact: 9876543213,
        email: "sneha@example.com",
        password: hashedPassword,
        isVerified: true,
      },
      {
        name: "Vikram Singh",
        contact: 9876543214,
        email: "vikram@example.com",
        password: hashedPassword,
        isVerified: true,
      },
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // Create Sellers
    console.log("🏪 Creating sellers...");
    const sellers = await Seller.insertMany([
      {
        name: "Ramesh Farmer",
        contact: 9123456780,
        email: "ramesh@farm.com",
        password: hashedPassword,
        brandName: "Ramesh Organics",
        isVerified: true,
      },
      {
        name: "Suresh Agro",
        contact: 9123456781,
        email: "suresh@agro.com",
        password: hashedPassword,
        brandName: "Suresh Fresh Farms",
        isVerified: true,
      },
      {
        name: "Kiran Traders",
        contact: 9123456782,
        email: "kiran@traders.com",
        password: hashedPassword,
        brandName: "Kiran Wholesale",
        isVerified: true,
      },
      {
        name: "Meena Agriculture",
        contact: 9123456783,
        email: "meena@agri.com",
        password: hashedPassword,
        brandName: "Meena Natural Products",
        isVerified: true,
      },
    ]);
    console.log(`✅ Created ${sellers.length} sellers\n`);

    // Create Products
    console.log("🌾 Creating products...");
    const products = await Product.insertMany([
      // Rice Products
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748054/AgroConnect/products/rice1.jpg",
        brand: "Ramesh Organics",
        name: "Premium Basmati Rice",
        category: "rice",
        description: "Aromatic long-grain basmati rice, aged for 2 years. Perfect for biryani and pulao. Grown organically without pesticides.",
        pricePerUnit: 80,
        measuringUnit: "kg",
        minimumOrderQuantity: 100,
        location: { latitude: 28.7041, longitude: 77.1025 },
        quantity: 5000,
        shelfLife: "12 months",
        sellerId: sellers[0]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748055/AgroConnect/products/rice2.jpg",
        brand: "Suresh Fresh Farms",
        name: "Sona Masoori Rice",
        category: "rice",
        description: "Light and aromatic medium-grain rice. Ideal for daily meals. Low in starch, easy to digest.",
        pricePerUnit: 60,
        measuringUnit: "kg",
        minimumOrderQuantity: 200,
        location: { latitude: 17.3850, longitude: 78.4867 },
        quantity: 8000,
        shelfLife: "10 months",
        sellerId: sellers[1]._id,
      },

      // Wheat Products
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748056/AgroConnect/products/wheat1.jpg",
        brand: "Kiran Wholesale",
        name: "Whole Wheat Grain",
        category: "wheat",
        description: "Premium quality whole wheat grains. High in fiber and nutrients. Freshly harvested this season.",
        pricePerUnit: 30,
        measuringUnit: "kg",
        minimumOrderQuantity: 500,
        location: { latitude: 30.9010, longitude: 75.8573 },
        quantity: 15000,
        shelfLife: "8 months",
        sellerId: sellers[2]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748223/AgroConnect/products/wheat2.jpg",
        brand: "Ramesh Organics",
        name: "Organic Wheat Flour",
        category: "wheat",
        description: "Stone-ground organic wheat flour. No additives or preservatives. Perfect for rotis and bread.",
        pricePerUnit: 45,
        measuringUnit: "kg",
        minimumOrderQuantity: 300,
        location: { latitude: 28.7041, longitude: 77.1025 },
        quantity: 6000,
        shelfLife: "6 months",
        sellerId: sellers[0]._id,
      },

      // Vegetables
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748057/AgroConnect/products/tomato.jpg",
        brand: "Meena Natural Products",
        name: "Fresh Tomatoes",
        category: "vegetables",
        description: "Vine-ripened red tomatoes. Rich in lycopene. Freshly harvested daily from organic farms.",
        pricePerUnit: 25,
        measuringUnit: "kg",
        minimumOrderQuantity: 50,
        location: { latitude: 18.5204, longitude: 73.8567 },
        quantity: 2000,
        shelfLife: "1 week",
        sellerId: sellers[3]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748058/AgroConnect/products/potato.jpg",
        brand: "Suresh Fresh Farms",
        name: "Farm Fresh Potatoes",
        category: "vegetables",
        description: "High-quality potatoes. Perfect for cooking and frying. Stored in controlled environment.",
        pricePerUnit: 20,
        measuringUnit: "kg",
        minimumOrderQuantity: 100,
        location: { latitude: 17.3850, longitude: 78.4867 },
        quantity: 5000,
        shelfLife: "2 months",
        sellerId: sellers[1]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748059/AgroConnect/products/onion.jpg",
        brand: "Meena Natural Products",
        name: "Organic Onions",
        category: "vegetables",
        description: "Fresh red onions. No chemical fertilizers used. Strong flavor and long shelf life.",
        pricePerUnit: 30,
        measuringUnit: "kg",
        minimumOrderQuantity: 150,
        location: { latitude: 18.5204, longitude: 73.8567 },
        quantity: 4000,
        shelfLife: "3 months",
        sellerId: sellers[3]._id,
      },

      // Fruits
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748060/AgroConnect/products/mango.jpg",
        brand: "Suresh Fresh Farms",
        name: "Alphonso Mangoes",
        category: "fruits",
        description: "King of mangoes! Sweet and aromatic Alphonso mangoes from Ratnagiri. Premium quality.",
        pricePerUnit: 150,
        measuringUnit: "kg",
        minimumOrderQuantity: 50,
        location: { latitude: 17.3850, longitude: 78.4867 },
        quantity: 1000,
        shelfLife: "1 week",
        sellerId: sellers[1]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748060/AgroConnect/products/banana.jpg",
        brand: "Meena Natural Products",
        name: "Fresh Bananas",
        category: "fruits",
        description: "Premium quality Robusta bananas. Rich in potassium. Perfectly ripened.",
        pricePerUnit: 40,
        measuringUnit: "kg",
        minimumOrderQuantity: 100,
        location: { latitude: 18.5204, longitude: 73.8567 },
        quantity: 3000,
        shelfLife: "5 days",
        sellerId: sellers[3]._id,
      },

      // Spices
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749851/AgroConnect/products/chilli.png",
        brand: "Kiran Wholesale",
        name: "Red Chilli Powder",
        category: "spices",
        description: "Pure red chilli powder. Medium spice level. No artificial colors added. Premium quality.",
        pricePerUnit: 200,
        measuringUnit: "kg",
        minimumOrderQuantity: 25,
        location: { latitude: 30.9010, longitude: 75.8573 },
        quantity: 800,
        shelfLife: "18 months",
        sellerId: sellers[2]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749881/AgroConnect/products/turmeric.jpg",
        brand: "Ramesh Organics",
        name: "Turmeric Powder",
        category: "spices",
        description: "High curcumin content organic turmeric. Bright yellow color. Great for health and cooking.",
        pricePerUnit: 180,
        measuringUnit: "kg",
        minimumOrderQuantity: 30,
        location: { latitude: 28.7041, longitude: 77.1025 },
        quantity: 1200,
        shelfLife: "24 months",
        sellerId: sellers[0]._id,
      },

      // Pulses
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749785/AgroConnect/products/toorDal.jpg",
        brand: "Kiran Wholesale",
        name: "Toor Dal (Pigeon Peas)",
        category: "pulses",
        description: "Premium quality toor dal. Rich in protein. Cooks soft and delicious. Machine cleaned.",
        pricePerUnit: 120,
        measuringUnit: "kg",
        minimumOrderQuantity: 100,
        location: { latitude: 30.9010, longitude: 75.8573 },
        quantity: 4000,
        shelfLife: "12 months",
        sellerId: sellers[2]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749813/AgroConnect/products/moongDal.jpg",
        brand: "Suresh Fresh Farms",
        name: "Moong Dal (Green Gram)",
        category: "pulses",
        description: "Split green gram dal. Easy to digest. High in protein and fiber. Ideal for daily cooking.",
        pricePerUnit: 110,
        measuringUnit: "kg",
        minimumOrderQuantity: 150,
        location: { latitude: 17.3850, longitude: 78.4867 },
        quantity: 3500,
        shelfLife: "10 months",
        sellerId: sellers[1]._id,
      },

      // Nuts
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749914/AgroConnect/products/cashew.jpg",
        brand: "Meena Natural Products",
        name: "Cashew Nuts",
        category: "nuts",
        description: "Premium whole cashew nuts. Rich and creamy. Perfect for snacking and cooking.",
        pricePerUnit: 600,
        measuringUnit: "kg",
        minimumOrderQuantity: 20,
        location: { latitude: 18.5204, longitude: 73.8567 },
        quantity: 500,
        shelfLife: "6 months",
        sellerId: sellers[3]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749972/AgroConnect/products/almond.jpg",
        brand: "Ramesh Organics",
        name: "Almonds",
        category: "nuts",
        description: "California almonds. Rich in vitamin E and healthy fats. Great for health.",
        pricePerUnit: 700,
        measuringUnit: "kg",
        minimumOrderQuantity: 15,
        location: { latitude: 28.7041, longitude: 77.1025 },
        quantity: 400,
        shelfLife: "8 months",
        sellerId: sellers[0]._id,
      },

      // Sugar
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791749942/AgroConnect/products/sugar.jpg",
        brand: "Kiran Wholesale",
        name: "White Crystal Sugar",
        category: "sugar",
        description: "Pure refined white sugar. Crystal clear. Perfect for all cooking and baking needs.",
        pricePerUnit: 40,
        measuringUnit: "kg",
        minimumOrderQuantity: 500,
        location: { latitude: 30.9010, longitude: 75.8573 },
        quantity: 20000,
        shelfLife: "24 months",
        sellerId: sellers[2]._id,
      },
      {
        image: "https://res.cloudinary.com/prb5ojt7/image/upload/v1791748934/AgroConnect/products/jaggery.jpg",
        brand: "Suresh Fresh Farms",
        name: "Organic Jaggery",
        category: "sugar",
        description: "Traditional jaggery made from sugarcane. No chemicals. Rich in minerals and iron.",
        pricePerUnit: 60,
        measuringUnit: "kg",
        minimumOrderQuantity: 200,
        location: { latitude: 17.3850, longitude: 78.4867 },
        quantity: 5000,
        shelfLife: "12 months",
        sellerId: sellers[1]._id,
      },
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // Create Orders
    console.log("📦 Creating orders...");
    const orders = await Order.insertMany([
      {
        productId: products[0]._id,
        userId: users[0]._id,
        sellerId: sellers[0]._id,
        orderQty: 100,
        orderLocation: { latitude: 28.5355, longitude: 77.3910 },
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        productId: products[1]._id,
        userId: users[1]._id,
        sellerId: sellers[1]._id,
        orderQty: 200,
        orderLocation: { latitude: 17.4400, longitude: 78.3489 },
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        productId: products[2]._id,
        userId: users[2]._id,
        sellerId: sellers[2]._id,
        orderQty: 500,
        orderLocation: { latitude: 30.7333, longitude: 76.7794 },
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        productId: products[4]._id,
        userId: users[0]._id,
        sellerId: sellers[3]._id,
        orderQty: 50,
        orderLocation: { latitude: 19.0760, longitude: 72.8777 },
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        productId: products[7]._id,
        userId: users[3]._id,
        sellerId: sellers[1]._id,
        orderQty: 50,
        orderLocation: { latitude: 12.9716, longitude: 77.5946 },
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        productId: products[9]._id,
        userId: users[4]._id,
        sellerId: sellers[2]._id,
        orderQty: 25,
        orderLocation: { latitude: 22.5726, longitude: 88.3639 },
        date: new Date(), // Today
      },
    ]);
    console.log(`✅ Created ${orders.length} orders\n`);

    // Create Reviews
    console.log("⭐ Creating reviews...");
    const reviews = await Review.insertMany([
      {
        userId: users[0]._id,
        productId: products[0]._id,
        stars: 5,
        heading: "Excellent Quality!",
        description: "Best basmati rice I've ever purchased. Grains are long and aromatic. Highly recommended for biryani!",
      },
      {
        userId: users[1]._id,
        productId: products[1]._id,
        stars: 4,
        heading: "Very Good",
        description: "Good quality rice. Value for money. Cooks well and tastes great.",
      },
      {
        userId: users[2]._id,
        productId: products[2]._id,
        stars: 5,
        heading: "Premium Wheat",
        description: "Excellent wheat quality. Freshly harvested. Makes soft rotis. Will order again!",
      },
      {
        userId: users[0]._id,
        productId: products[4]._id,
        stars: 4,
        heading: "Fresh Tomatoes",
        description: "Good quality tomatoes. Fresh and juicy. Delivered on time.",
      },
      {
        userId: users[3]._id,
        productId: products[7]._id,
        stars: 5,
        heading: "Amazing Mangoes!",
        description: "Authentic Alphonso mangoes! Sweet and delicious. Worth every rupee!",
      },
      {
        userId: users[4]._id,
        productId: products[9]._id,
        stars: 5,
        heading: "Best Chilli Powder",
        description: "Pure and spicy. No artificial color. Perfect for Indian cooking.",
      },
    ]);
    console.log(`✅ Created ${reviews.length} reviews\n`);

    // Create FAQs
    console.log("❓ Creating FAQs...");
    const faqs = await FAQ.insertMany([
      {
        question: "What is the minimum order quantity?",
        answer: "The minimum order quantity for this product is 100 kg. We offer bulk discounts for orders above 500 kg.",
        isAnswered: true,
        productId: products[0]._id,
        sellerId: sellers[0]._id,
        userId: users[0]._id,
      },
      {
        question: "Do you provide home delivery?",
        answer: "Yes, we provide free home delivery for orders above 200 kg. For smaller orders, delivery charges apply based on distance.",
        isAnswered: true,
        productId: products[1]._id,
        sellerId: sellers[1]._id,
        userId: users[1]._id,
      },
      {
        question: "Is this product organic?",
        answer: "Yes, this is 100% organic product. We have organic certification from the government. No pesticides or chemical fertilizers are used.",
        isAnswered: true,
        productId: products[3]._id,
        sellerId: sellers[0]._id,
        userId: users[2]._id,
      },
      {
        question: "What is the shelf life of tomatoes?",
        answer: "Fresh tomatoes have a shelf life of approximately 1 week when stored properly. Keep them in a cool, dry place.",
        isAnswered: true,
        productId: products[4]._id,
        sellerId: sellers[3]._id,
        userId: users[3]._id,
      },
      {
        question: "Can I get a sample before bulk order?",
        answer: "Yes, we can provide a 5 kg sample. Sample cost will be adjusted in your bulk order if placed within 7 days.",
        isAnswered: true,
        productId: products[9]._id,
        sellerId: sellers[2]._id,
        userId: users[4]._id,
      },
      {
        question: "Do you offer cash on delivery?",
        answer: "Currently pending answer from seller...",
        isAnswered: false,
        productId: products[2]._id,
        sellerId: sellers[2]._id,
        userId: users[1]._id,
      },
    ]);
    console.log(`✅ Created ${faqs.length} FAQs\n`);

    // Summary
    console.log("🎉 Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Sellers: ${sellers.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - FAQs: ${faqs.length}\n`);

    console.log("🔑 Test Login Credentials:");
    console.log("\n📱 Users:");
    console.log("   Email: rahul@example.com | Password: password123");
    console.log("   Email: priya@example.com | Password: password123");
    console.log("   Email: amit@example.com | Password: password123");
    console.log("\n🏪 Sellers:");
    console.log("   Email: ramesh@farm.com | Password: password123");
    console.log("   Email: suresh@agro.com | Password: password123");
    console.log("   Email: kiran@traders.com | Password: password123");
    console.log("   Email: meena@agri.com | Password: password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
