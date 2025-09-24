const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, admin, upload.array("images", 5), createProperty);
router.put("/:id", protect, admin, upload.array("images", 5), updateProperty);
router.delete("/:id", protect, admin, deleteProperty);

module.exports = router;
