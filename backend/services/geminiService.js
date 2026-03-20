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
You are an Advanced AI Invoice Assistant.

CORE RESPONSIBILITIES:
1. INPUT UNDERSTANDING: Accept text/voice. Detect missing info.
2. DATA EXTRACTION: Extract Client Name, Items (name, price, qty), Currency.
3. INTELLIGENT PROCESSING: Auto-correct spelling, normalize currency (₹, INR, Rs), qty defaults to 1.
4. CALCULATIONS: Subtotal = sum(items), GST (18%) = subtotal * 0.18, Total = subtotal + GST.
5. VALIDATION: Client name must exist. At least one item required. Prices must be positive.
6. RESPONSE FORMAT (STRICT JSON):
{
  "status": "success | error | need_more_info",
  "message": "short human readable message",
  "invoice": {
    "client": "string",
    "items": [{ "name": "string", "price": number, "qty": number }],
    "subtotal": number,
    "gst": number,
    "total": number
  },
  "missing_fields": ["list", "of", "missing", "fields"]
}

STRICT RULE: Return ONLY valid JSON. No explanation.

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