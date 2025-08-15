
import { GoogleGenAI } from "@google/genai";
import { type GroundingChunk, type SearchResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generateImage(prompt: string): Promise<string | null> {
  try {
    const descriptivePrompt = `A photorealistic, high-quality image representing the concept: "${prompt}"`;
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: descriptivePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.warn("Image generation failed:", error);
    return null; 
  }
}


export async function searchWithGoogle(query: string): Promise<SearchResult> {
  try {
    const [searchResponse, imageUrl] = await Promise.all([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      }),
      generateImage(query)
    ]);
    
    const answer = searchResponse.text;
    const groundingMetadata = searchResponse.candidates?.[0]?.groundingMetadata;
    const rawSources = groundingMetadata?.groundingChunks || [];

    // Filter and transform sources to match our strict internal type
    const sources: GroundingChunk[] = rawSources
      .filter(source => source.web?.uri) // Ensure URI exists
      .map(source => ({
        web: {
          uri: source.web!.uri!, // Non-null assertion is safe due to filter
          title: source.web!.title || source.web!.uri!, // Fallback title to URI
        },
      }));

    if (!answer) {
        throw new Error("Received an empty response from the API.");
    }
    
    return { answer, sources, imageUrl };

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch search results: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching search results.");
  }
}
