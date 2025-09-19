const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    mysqlId: { type: String, required: true },
    title: String,
    description: String,
    price: Number,
    location: String,
    type: String,
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    images: [String],
    createdAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
