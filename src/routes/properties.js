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

router.get("/", getProperties);
router.get("/:id", getPropertyById);

router.post("/", protect, admin, createProperty);
router.put("/:id", protect, admin, updateProperty);
router.delete("/:id", protect, admin, deleteProperty);

module.exports = router;
