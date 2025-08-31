
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateJsonContent = async (prompt: string, schema: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating JSON content:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred.";
  }
};

export const generateVideo = async (prompt: string, onProgress: (progress: number) => void): Promise<string> => {
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1
      }
    });

    onProgress(5); // Initial progress after request is sent
    let pollCount = 0;
    const maxPolls = 15; // Assume it takes around 2.5 minutes on average for polling

    while (!operation.done) {
      // Poll every 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      pollCount++;
      // Progress from 5% to 95% during the polling phase
      const progress = 5 + Math.min(Math.round((pollCount / maxPolls) * 90), 90);
      onProgress(progress);
    }
    
    onProgress(100); // Final progress

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
        throw new Error("Video generation completed but no download link was found.");
    }
    
    const response = await fetch(`${downloadLink}&key=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};