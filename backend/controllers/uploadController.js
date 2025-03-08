const { cloudinary } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const { successResponse, errorResponse } = require("../utils/helpers");

// Upload image to Cloudinary
const uploadImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json(errorResponse("No file uploaded"));
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bestfurfriends",
      resource_type: "image",
    });

    // Remove temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json(
      successResponse("Image uploaded successfully", {
        url: result.secure_url,
        public_id: result.public_id,
      })
    );
  } catch (error) {
    console.error("Error uploading image:", error);

    // Remove temporary file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }

    res.status(500).json(errorResponse("Failed to upload image"));
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(400).json(errorResponse("Failed to delete image"));
    }

    res.status(200).json(successResponse("Image deleted successfully"));
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json(errorResponse("Failed to delete image"));
  }
};

// POST /api/upload
// DELETE /api/upload/:publicId
module.exports = {
  uploadImage,
  deleteImage,
};
