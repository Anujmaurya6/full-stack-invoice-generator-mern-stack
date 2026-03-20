import axios from "axios";

// 🔥 PRODUCTION URL - hardcoded to avoid build-time env issues on Vercel
const PRODUCTION_API = "https://full-stack-invoice-generator-mern-stack.onrender.com/api";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== "" 
    ? import.meta.env.VITE_API_URL 
    : PRODUCTION_API,
});

// 🔥 TOKEN AUTO ADD
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔥 FUNCTIONS
export const getInvoices = async () => {
  const res = await API.get("/invoices");
  return res.data;
};

export const createInvoice = async (data) => {
  const res = await API.post("/invoices", data);
  return res.data;
};

export const updateInvoice = async (id, data) => {
  const res = await API.put(`/invoices/${id}`, data);
  return res.data;
};
export default API; // 🔥 THIS MUST EXIST