
import { GoogleGenAI, Type } from "@google/genai";
import { RawExtractedItem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a sales administrative assistant bot. Your goal is to extract product purchase intent.
The user might provide text descriptions, images of lists, or specific instructions to MODIFY an existing item in their draft.

Rules:
1. Extract a list of products.
2. For each, identify "purchasedName" and "purchasedQty".
3. If the user provides a "context_item", they are trying to REPLACE or UPDATE that specific item. 
4. If it's an update, the new "purchasedName" should reflect their desired change (e.g., higher wattage, different color) while keeping the intent clear.
5. If the user only mentions a change (e.g., "make it 550W"), assume the base product is the context_item and only the specific attribute changed.
`;

export const parseUserMessage = async (
  text: string, 
  imageBase64?: string,
  contextItemName?: string
): Promise<RawExtractedItem[]> => {
  try {
    const parts: any[] = [];
    
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: cleanBase64
        }
      });
    }
    
    let prompt = text;
    if (contextItemName) {
      prompt = `USER WANTS TO MODIFY EXISTING ITEM: "${contextItemName}". \nUSER REQUEST: "${text}"`;
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              purchasedName: { type: Type.STRING },
              purchasedQty: { type: Type.INTEGER },
            },
            required: ["purchasedName"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const extracted: RawExtractedItem[] = JSON.parse(jsonText);
    return extracted;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
