import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many AI requests, try again later"
});