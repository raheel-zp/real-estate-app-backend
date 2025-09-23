const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
} = require("../controllers/inquiryController");
const { protect, admin } = require("../middleware/authMiddleware");

// POST inquiry for property
router.post("/:propertyId/inquire", createInquiry);

router.get(
  "/",
  protect,
  admin,
  async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  },
  getInquiries
);

module.exports = router;
