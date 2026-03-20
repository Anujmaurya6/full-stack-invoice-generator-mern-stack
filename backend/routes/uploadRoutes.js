import express from "express";
import { upload } from "../utils/multer.js";
import { uploadAssets } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 }
  ]),
  uploadAssets
);

export default router;