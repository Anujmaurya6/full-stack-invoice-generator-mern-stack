import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ CREATE DIRECTORIES IF NOT EXIST
const dirs = ["uploads/logos", "uploads/signatures", "uploads/pdfs"];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, "uploads/logos/");
    } else if (file.fieldname === "signature") {
      cb(null, "uploads/signatures/");
    } else {
      cb(null, "uploads/");
    }
  },
  
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
