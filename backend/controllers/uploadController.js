import User from "../models/User.js";

export const uploadAssets = async (req, res) => {
  try {
    // ✅ FIXED: Use req.user directly (it's already the ID)
    const userId = req.user;

    let updateData = {};

    if (req.files.logo) {
      updateData.logo = req.files.logo[0].path;
    }

    if (req.files.signature) {
      updateData.signature = req.files.signature[0].path;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: "Uploaded successfully",
      user
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err.message);
    res.status(500).json({ message: "Upload failed" });
  }
};
