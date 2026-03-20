import API from "./api";

export const createOrder = () => API.post("/payment/order");

export const verifyPayment = (data) =>
  API.post("/payment/verify", data);
