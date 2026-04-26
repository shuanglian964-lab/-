import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Writer {
  name: string;
  era: string; 
  description: string;
  representativeWork: string;
  quote: string;
  locationContext: string;
  books: { title: string; info: string }[];
}

export async function searchWritersByLocation(location: string): Promise<Writer[]> {
  const prompt = `你是一位精通中国现代文学的向导。
  请根据地点 "${location}"，返回3到4位在该地生活、创作或留下深刻足迹的作家。
  年代跨度从民国到当代。
  
  请以 JSON 格式返回，包含以下字段（JSON数组形式）:
  - name: 作家姓名
  - era: 年代 (例如：民国, 当代)
  - description: 简短描述作家的文学成就
  - representativeWork: 在该地创作或与该地直接相关的代表作
  - quote: 一句展现该作家对该地感触的文学引文（需与该地直接相关）
  - locationContext: 该作家与该地点的具体联系，作为旅行者选择文案的视角
  - books: 数组，包含 { title: 书名, info: 该书的出版信息或简介 }

  请只返回纯 JSON 内容，不要包含 Markdown 格式。`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = result.text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
}
