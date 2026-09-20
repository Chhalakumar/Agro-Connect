const { cropPredictorServices } = require("../services/cropPredictorServices");


// Crop Prediction
const predictCrops = async (req, res) => {
  try {
    const { soil, altitude, temperature, humidity, rainfall } = req.query;
    
    console.log("🌾 Crop prediction request received");
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("PASTE")) {
      return res.status(503).send({ 
        message: "CropSense AI is not configured. Please add a valid GEMINI_API_KEY to use this feature." 
      });
    }
    
    if (!soil || !altitude || !temperature || !humidity || !rainfall) {
      return res.status(400).send({ message: "Missing required parameters" });
    }

    const altitudeNum = parseFloat(altitude);
    const temperatureNum = parseFloat(temperature);
    const humidityNum = parseFloat(humidity);
    const rainfallNum = parseFloat(rainfall);

    if (isNaN(altitudeNum) || isNaN(temperatureNum) || isNaN(humidityNum) || isNaN(rainfallNum)) {
      return res.status(400).send({ message: "Invalid parameter values. All numeric values must be valid numbers." });
    }

    const result = await cropPredictorServices(soil, altitudeNum, temperatureNum, humidityNum, rainfallNum);
    console.log("✅ Prediction completed");
    return res.status(200).send({ message: result });
  } catch (error) {
    console.error("❌ Crop prediction error:", error);
    
    // Check for specific Gemini API errors
    if (error.message && (error.message.includes("API key") || error.message.includes("not found"))) {
      return res.status(503).send({ 
        message: "Gemini AI service is currently unavailable. The AQ. format API keys are not compatible with this implementation. Please contact support.",
        hint: "This feature requires Google AI Studio API keys starting with 'AIza'"
      });
    }
    
    if (error.status === 429) {
      return res.status(429).send({ 
        message: "Gemini AI rate limit exceeded. Please try again later." 
      });
    }
    
    return res.status(500).send({ 
      message: "Failed to generate crop prediction. API key format may be incompatible.",
      error: error.message 
    });
  }
};


module.exports = {
  predictCrops,
};
