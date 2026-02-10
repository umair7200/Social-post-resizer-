
import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, DesignTheme } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is not configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Recreates and reimagines the source design for a specific platform using gemini-2.5-flash-image.
 * This is an intelligent re-composition, not a simple crop.
 */
export const adaptImageForPlatform = async (
  base64Image: string,
  platformName: string,
  postType: string,
  aspectRatio: AspectRatio,
  creativeDirection: string,
  theme: DesignTheme,
  userBrief: string
): Promise<string> => {
  const ai = getAiClient();
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const themeInstruction = theme === 'original' 
    ? "STRICTLY maintain the original color palette, lighting, and brand identity." 
    : `Transform the design into a premium ${theme} mode aesthetic. ${theme === 'dark' ? 'Use deep shadows, sophisticated contrast, and elegant dark backgrounds.' : 'Use high-key lighting, clean whitespace, and soft shadows.'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          },
        },
        {
          text: `TASK: Re-render and RE-LAYOUT this visual for a ${platformName} ${postType} (Aspect Ratio: ${aspectRatio}).
                 
                 CREATIVE DIRECTION: ${creativeDirection}
                 USER BRIEF: ${userBrief || "Apply world-class graphic design principles."}
                 THEME: ${themeInstruction}
                 
                 RULES:
                 1. COMPOSITION: Intelligently rearrange the subject, background, and elements for the ${aspectRatio} ratio. Ensure no critical parts are cut off.
                 2. FIDELITY: Maintain the visual DNA and recognizable subjects from the original image.
                 3. QUALITY: Generate a professional, high-resolution asset suitable for a brand's official ${platformName} account.
                 4. STYLE: Native look and feel for ${platformName}.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error("No response from image generation model.");

  for (const part of parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to extract recreated image from AI response.");
};

/**
 * Brainstorms the creative strategy and generates social media content using gemini-3-pro-preview.
 */
export const brainstormAndGenerateContent = async (
  base64Image: string,
  platformName: string,
  postType: string,
  userBrief: string,
  theme: DesignTheme
): Promise<{ caption: string; hashtags: string[]; creativeReasoning: string }> => {
  const ai = getAiClient();
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          },
        },
        {
          text: `Analyze this image and plan a native-feeling version for ${platformName} (${postType}) with a ${theme} aesthetic. 
                 User Request: "${userBrief || 'Optimize for high engagement'}".
                 
                 Return a JSON object:
                 1. 'creativeReasoning': A concise explanation (under 120 characters) of how the composition should be adapted for ${platformName}.
                 2. 'caption': A highly engaging, professional social media caption.
                 3. 'hashtags': 5 relevant hashtags including platform-specific trends.`,
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          creativeReasoning: { type: Type.STRING },
          caption: { type: Type.STRING },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["creativeReasoning", "caption", "hashtags"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from strategist model.");
  }

  try {
    return JSON.parse(text.trim());
  } catch (err) {
    console.error("Parse error:", err);
    return {
      creativeReasoning: `Optimizing layout for ${platformName} to maximize visual impact.`,
      caption: `Freshly reimagined for your ${platformName} feed.`,
      hashtags: ["#ai-art", "#socialmedia", `#${platformName.toLowerCase()}`]
    };
  }
};
