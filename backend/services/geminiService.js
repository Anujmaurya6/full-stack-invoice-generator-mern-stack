import axios from "axios";
import { safeJsonParse } from "../utils/safeJsonParse.js";

export const generateInvoiceAI = async (prompt, plan) => {
  try {
    const isPro = plan === "PRO";

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are a professional invoice generator.

STRICT RULES:
- Return ONLY JSON
- No explanation
- No extra text

Format:
{
  "clientName": "string",
  "items": [
    { "description": "string", "quantity": number, "rate": number }
  ],
  "amount": number,
  "status": "Paid",
  "theme": "${isPro ? "color" : "black"}",
  "layout": "${isPro ? "modern" : "simple"}"
}

User Input:
${prompt}
`
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty AI response");

    return safeJsonParse(text);

  } catch (err) {
    console.error(err.message);
    throw new Error("AI generation failed");
  }
};