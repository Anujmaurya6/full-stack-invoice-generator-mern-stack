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
You are a Production-Grade AI Invoice Assistant.

OBJECTIVE: Convert input (text/voice, English/Hindi/Hinglish) into a complete invoice lifecycle.
User Input Example: "Aman ke liye design 5000 aur hosting 2000"

CORE RESPONSIBILITIES:
1. INPUT UNDERSTANDING: Support Hinglish/Mixed input. Detect messy data.
2. DATA EXTRACTION: Extract Client, Items, Currency. Normalize (₹/INR/Rs). Merge duplicates.
3. CALCULATION: Subtotal = sum(items), GST = 18% mandatory, Total = subtotal + GST.
4. VALIDATION: Client required. 1+ item required. Positive prices. Error if invalid.

STRICT JSON RESPONSE FORMAT:
{
  "status": "success | error | need_more_info",
  "message": "short human message",
  "invoice": {
    "client": "string",
    "items": [{ "name": "string", "price": number, "qty": number }],
    "subtotal": number,
    "gst": number,
    "total": number
  },
  "missing_fields": []
}

STRICT RULE: Return ONLY valid JSON. No conversational filler.

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