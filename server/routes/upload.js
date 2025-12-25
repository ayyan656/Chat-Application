const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary.js"); 

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image or video files are allowed!"), false);
    }
  },
});

router.post("/api", upload.single("file"), async (req, res) => {
  console.log("📥 Upload request received");

  // Check if a file was provided by Multer
  if (!req.file) {
    console.log("❌ No file uploaded.");
    return res.status(400).json({ error: "No file provided in the request." });
  }

  console.log("📄 File received:", {
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  try {
    const uploadPromise = new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader
        .upload_stream(
          {
            folder: "mern_simple",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    const result = await uploadPromise;

    console.log("✅ Cloudinary uploaded:", result.secure_url);

    return res.status(200).json({
      message: "File uploaded successfully!",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", {
      message: error.message,
      stack: error.stack,
      cloudinaryError: error.error,
    });

    return res.status(500).json({
      error: "Upload failed",
      details: error.message,

      cloudinaryError:
        error.error && error.error.message ? error.error.message : undefined,
    });
  }
});

module.exports = router;
