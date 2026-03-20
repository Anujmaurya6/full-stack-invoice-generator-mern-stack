import API from "./api";

export const generateAIInvoice = async (prompt) => {

  const res = await API.post("/ai/generate",{
    prompt
  });

  return res.data;

};