import API from "./api";

export const getDashboardStats = () => API.get("/invoice/dashboard");

export const getInvoices = () => API.get("/invoice");

export const getInvoiceById = (id) => API.get(`/invoice/${id}`);

export const createInvoice = (data) => API.post("/invoice", data);

export const updateInvoice = (id, data) =>
  API.put(`/invoice/${id}`, data);

export const deleteInvoice = (id) =>
  API.delete(`/invoice/${id}`);
