const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoritesController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", protect, admin, getFavorites);
router.post("/:propertyId", protect, admin, addFavorite);
router.delete("/:propertyId", protect, admin, removeFavorite);

module.exports = router;
