import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in your environment or secrets.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface Writer {
  name: string;
  era: string; 
  description: string;
  biography: string;
  representativeWork: string;
  quotes: string[];
  locationContext: string;
  books: { title: string; info: string }[];
}

export async function searchWritersByLocation(location: string): Promise<Writer[]> {
  try {
    const ai = getAi();
    
    const prompt = `你是一位精通中国文学的灵魂向导。
  请根据地点 "${location}"，返回3到4位在该地生活、创作或留下深刻足迹的作家。
  
  要求：
  1. 年代跨度要广：必须平衡包含民国时期和当代（1949年后至今，尤其是活跃在当代的）中国作家。不要只提供民国文人。
  2. 每一位作家请提供2-3句在该地创作或与该地直接相关的、具有不同视角或感触的文学名句（quotes）。
  3. 提供作家的简要生平（biography），约100字左右，风格要优美且富有洞察力。

  请以 JSON 数组格式返回，包含以下字段:
  - name: 作家姓名
  - era: 年代 (例如：民国, 当代, 现代)
  - description: 简短一句话描述作家的文学成就
  - biography: 作家生平简介
  - representativeWork: 在该地创作或与该地直接相关的核心代表作
  - quotes: 数组，包含2-3句展现该作家对该地感触的文学引文（需与该地直接相关）
  - locationContext: 该作家与该地点的具体联系，作为旅行者选择文案的视角
  - books: 数组，包含 { title: 书名, info: 该书的出版信息或简介 }

  请随机挑选，确保每次返回的内容具有差异性，不要总是重复同一批名家。
  请严格返回 JSON 数组，不要包含任何 Markdown 代码块标记或额外说明文字。`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    if (!result.text) {
      console.error("Gemini returned empty text response");
      return [];
    }

    const text = result.text.trim();
    // Sometimes the model still includes markdown even with responseMimeType
    const cleanJson = text.replace(/^```json/, "").replace(/```$/, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return [];
  }
}
