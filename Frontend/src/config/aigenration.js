
import { GoogleGenerativeAI } from "@google/generative-ai";
async function fileOrBlobToBase64(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
     
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(fileOrBlob); // Read as data URL
  });
}

export async function processCarImageWithAI(file) {
  try {
    
    const apiKey = import.meta.env.VITE_AIAPI; 
    if (!apiKey) {
      console.error("Error: Gemini API key is not configured in environment variables (e.g., VITE_GEMINI_API_KEY).");
      throw new Error("Gemini API key is not configured.");
    }

    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    
    if (!(file instanceof File)) {
      console.error("Invalid input for 'file'. Expected a File object.");
      throw new Error("Invalid input: 'file' must be a File object.");
    }

    const base64Image = await fileOrBlobToBase64(file);
    const mimeType = file.type; 

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };


    const prompt = `
      Analyze this car image and extract the following information:
      1. Make (manufacturer), "Maruti Suzuki", "Tata Motors", "Mahindra & Mahindra", "Force Motors", "Ashok Leyland",
    "Bajaj Auto", "Eicher Motors", "Hindustan Motors", "Toyota", "Honda", "Ford",
    "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Nissan", "Hyundai",
    "Kia", "Mazda", "Subaru", "Lexus", "Acura", "Infiniti", "MG Motor", "Renault",
    "Skoda", "Citroën", "Jeep", "Volvo", "Porsche", "Lamborghini", "Ferrari",
    "Bentley", "Rolls-Royce", "Maserati", "Mini", "Aston Martin", "BYD", "Isuzu", "Lotus"   give the names loke this
      2. Model
      3. Year (approximately, if detectable, otherwise use 0000)
      4. Color
      5. Body type (e.g., SUV, Sedan, Hatchback, Pickup, Coupe, Van, Wagon, Convertible, Minivan, Crossover. If unsure, specify "Unknown").
      6. Approximate Mileage or average per liter (20,23 like in kmph  whichever company claims,try to gusess , "N/A" if not detectable).
      7. Fuel type (your best guess: Petrol, Diesel, Electric, Hybrid, CNG, LPG. If unsure, specify "Unknown").
      8. Transmission type (your best guess: Manual, Automatic, CVT, Semi-Automatic. If unsure, specify Unknown).
      9. Estimated Price (your best guess,not give the range give direct value  include currency like use the indian currency. If not detectable, specify "N/A" or "0").
      10. Short Description (a concise, engaging description suitable for a car listing, maximum 100 words. Focus on key features or appeal).

      Format your response strictly as a clean JSON object with these exact keys.
      Ensure all fields are present, even if you fill them with "0000", "N/A", "Unknown", or an empty string "" if the information is genuinely undetectable.

      {
        "make": "string",
        "model": "string",
        "year": 0000,
        "color": "string",
        "price": "string",
        "mileage": "string",
        "bodyType": "string",
        "fuelType": "string",
        "transmission": "string",
        "description": "string",
      }

    `;

    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```(?:json|txt|text)?\n?([\s\S]*?)```/g, "$1").trim();

    try {
      const carDetails = JSON.parse(cleanedText);

      
      const requiredFields = [
        "make", "model", "year", "color", "price", "mileage",
        "bodyType", "fuelType", "transmission", "description", "confidence"
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );

      if (missingFields.length > 0) {
        //console.warn(`AI response missing expected fields: ${missingFields.join(", ")}. Raw response: ${cleanedText}`);
      }

      
      if (typeof carDetails.year !== 'number') carDetails.year = parseInt(carDetails.year) || 0;
      if (typeof carDetails.price !== 'string') carDetails.price = String(carDetails.price || "N/A");
      if (typeof carDetails.mileage !== 'string') carDetails.mileage = String(carDetails.mileage || "N/A");


      
      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response (unparsed):", text); // Log original raw text for debugging
      return {
        success: false,
        error: `Failed to parse AI response. Raw output logged to console. Error: ${parseError.message}`,
      };
    }
  } catch (error) {
    console.error("An error occurred during AI image processing:", error);
    throw new Error("Failed to process image with AI: " + error.message);
  }
}