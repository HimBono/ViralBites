import { GoogleGenAI } from "@google/genai";
import { Place, SearchFilters } from "../types";

// Helper to calculate distance (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Number(d.toFixed(1));
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const searchViralSpots = async (
  userLat: number,
  userLng: number,
  filters: SearchFilters
): Promise<Place[]> => {
  // Initialize AI client lazily to ensure environment variables are ready and prevent top-level crashes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const { query, category, priceRange, openNow } = filters;

  const categoryPrompt = category !== 'all' ? `specifically in the category of "${category}"` : "across various categories like cafes, street food, and restaurants";
  const pricePrompt = priceRange !== 'any' ? `with a price range of ${priceRange}` : "";
  const locationPrompt = query ? `in or near ${query}` : `near coordinate ${userLat}, ${userLng}`;
  
  const systemInstruction = `
    You are an expert food explorer API.
    Your goal is to find "Viral" and trending food spots.
    You must return a valid JSON array of objects.
    
    Each object must strictly follow this structure:
    {
      "id": "string (unique)",
      "name": "string",
      "description": "string (short, catchy description of why it's viral)",
      "latitude": number,
      "longitude": number,
      "address": "string",
      "googleRating": number (0-5, float),
      "webRating": number (0-5, float. This is a simulated aggregate score you calculate based on sentiment from sources like Yelp, TripAdvisor, TikTok mentions found in search),
      "reviewCount": number (integer estimate),
      "priceLevel": "Cheap" | "Moderate" | "Expensive" | "Luxury",
      "tags": ["string", "string"],
      "mustTryItem": "string (The one specific viral dish to order)",
      "isOpen": boolean (based on current time/search knowledge),
      "imageUrl": "string (use https://picsum.photos/400/300?random={id} as placeholder)"
    }
  `;

  const userPrompt = `
    Find 6 to 10 viral, trending, or highly-rated food spots ${locationPrompt} ${categoryPrompt} ${pricePrompt}.
    Prioritize places that are visually aesthetic or famous for a specific dish.
    Use Google Maps to verify locations and Google Search to find "viral" sentiment and ratings from other platforms.
    Ensure coordinates are accurate numbers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLat,
              longitude: userLng
            }
          }
        },
      },
    });

    const text = response.text;
    if (!text) {
        console.warn("Gemini returned empty text");
        return [];
    }
    
    // Robust extraction: find the first '[' and last ']'
    const startIndex = text.indexOf('[');
    const endIndex = text.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
        console.error("No JSON array found in Gemini response", text);
        return [];
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    try {
      const places: Place[] = JSON.parse(jsonString);
      
      // Post-process to add distance and ensure images
      return places.map((p, idx) => ({
        ...p,
        id: p.id || `place-${idx}`, // Fallback ID
        distance: calculateDistance(userLat, userLng, p.latitude, p.longitude),
        imageUrl: p.imageUrl || `https://picsum.photos/400/300?random=${idx}`
      }));

    } catch (e) {
      console.error("Failed to parse Gemini JSON response", e, jsonString);
      return [];
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};