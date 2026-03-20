import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";

// 🔥 ROUTES IMPORT
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

// ✅ CREATE REQUIRED DIRECTORIES
const dirs = [
  "uploads",
  "uploads/logos",
  "uploads/signatures",
  "uploads/pdfs"
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 STATIC FILES
app.use("/uploads", express.static("uploads"));

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ 
    status: "ok",
    message: "Invoice Generator API 🚀",
    version: "1.0.0"
  });
});

// ✅ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ 
    msg: "Route not found",
    path: req.originalUrl 
  });
});

// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({ 
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 🔥 DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.log("❌ DB ERROR:", err.message);
    process.exit(1);
  });

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ✅ GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});
