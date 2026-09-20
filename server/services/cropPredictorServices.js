// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Access your API key as an environment variable
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function cropPredictorServices(soil, altitude, temperature, humidity, rainfall) {
//   try {
//     // Check if API key is set
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error("GEMINI_API_KEY is not set in environment variables");
//     }

//     console.log("🤖 Using Gemini AI for crop prediction...");

//     // Use gemini-2.0-flash model (Gemini 2.0)
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
//     const prompt =
//       `Predict the crops and give me data based on these environmental factors: Soil type: ${soil} Altitude (in km): ${altitude} Temperature (in degree Celsius): ${temperature} Humidity (in %): ${humidity} Rainfall (in mm): ${rainfall} Note: Ensure the following conditions are met: - Altitude should be a numerical value between 0 and 10 (kilometers). - Temperature should be a numerical value between -50 and 50 (degree Celsius). - Humidity should be a numerical value between 0 and 100 (%). - Rainfall should be a numerical value between 0 and 1000 (mm).`;

//     console.log("📊 Prediction parameters:", { soil, altitude, temperature, humidity, rainfall });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
    
//     console.log("✅ Crop prediction generated successfully");
//     return text;
//   } catch (error) {
//     console.error("❌ Gemini AI Error:", {
//       message: error.message,
//       code: error.code,
//       status: error.status
//     });
//     throw error;
//   }
// }

// module.exports = {
//   cropPredictorServices,
// };




// const { GoogleGenAI } = require("@google/genai");

// // Create Gemini client
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// async function cropPredictorServices(
//   soil,
//   altitude,
//   temperature,
//   humidity,
//   rainfall
// ) {
//   try {
//     // Check if API key is set
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error("GEMINI_API_KEY is not set in environment variables");
//     }

//     console.log("🤖 Using Gemini AI for crop prediction...");

//     console.log("📊 Prediction parameters:", {
//       soil,
//       altitude,
//       temperature,
//       humidity,
//       rainfall,
//     });

//     const prompt = `
// Predict suitable crops based on these environmental factors.

// Soil type: ${soil}
// Altitude: ${altitude} km
// Temperature: ${temperature} °C
// Humidity: ${humidity}%
// Rainfall: ${rainfall} mm

// Conditions:
// - Altitude must be between 0 and 10 km.
// - Temperature must be between -50 and 50 °C.
// - Humidity must be between 0 and 100%.
// - Rainfall must be between 0 and 1000 mm.

// Provide:
// 1. Top suitable crops
// 2. Reason why each crop is suitable
// 3. Suitable growing conditions
// 4. Basic farming recommendations

// Return the answer in a clear and readable format.
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-3.6-flash",
//       contents: prompt,
//     });

//     const text = response.text;

//     console.log("✅ Crop prediction generated successfully");

//     return text;
//   } catch (error) {
//     console.error("❌ Gemini AI Error:", {
//       message: error.message,
//       code: error.code,
//       status: error.status,
//     });

//     throw error;
//   }
// }

// module.exports = {
//   cropPredictorServices,
// };

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithRetry(prompt) {
  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
  ];

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`🤖 Trying ${model}, attempt ${attempt}`);

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        console.log(`✅ ${model} responded successfully`);

        return response.text;
      } catch (error) {
        console.log(
          `❌ ${model} attempt ${attempt} failed:`,
          error.message
        );

        // Wait before retrying
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
  }

  throw new Error("All Gemini models are temporarily unavailable.");
}

async function cropPredictorServices(
  soil,
  altitude,
  temperature,
  humidity,
  rainfall
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    console.log("🤖 Using Gemini AI for crop prediction...");

    console.log("📊 Prediction parameters:", {
      soil,
      altitude,
      temperature,
      humidity,
      rainfall,
    });

    const prompt = `
Predict suitable crops based on these environmental factors.

Soil type: ${soil}
Altitude: ${altitude} meters
Temperature: ${temperature} °C
Humidity: ${humidity}%
Rainfall: ${rainfall} mm

Provide:
1. Top suitable crops
2. Why each crop is suitable
3. Suitable growing conditions
4. Basic farming recommendations

Give a clear and useful answer for a farmer.
`;

    const text = await generateWithRetry(prompt);

    console.log("✅ Crop prediction generated successfully");

    return text;

  } catch (error) {
    console.error("❌ Gemini AI Error:", error.message);
    throw error;
  }
}

module.exports = {
  cropPredictorServices,
};