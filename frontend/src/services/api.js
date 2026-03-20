import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://full-stack-invoice-generator-mern-stack.onrender.com/api",
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