const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

exports.createInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const propertyId = req.params.propertyId;
    const inquiry = new Inquiry({
      property: propertyId,
      name,
      email,
      message,
    });
    await inquiry.save();

    res
      .status(201)
      .json({ message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("property", "title location price")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Server error" });
  }
};
