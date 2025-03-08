const express = require("express");
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const { upload } = require("../middleware/upload");
const { authenticateJWT } = require("../middleware/auth");
const { checkAdmin } = require("../middleware/admin");

const router = express.Router();

router.use(authenticateJWT);

// Upload image
router.post("/", upload.single("image"), uploadImage);

// Delete image (admin only)
router.delete("/:publicId", checkAdmin, deleteImage);

module.exports = router;
