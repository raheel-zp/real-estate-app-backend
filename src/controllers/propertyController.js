const Property = require("../models/Property");

exports.getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // 🔎 Filters
    let filter = {};

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.bedrooms) {
      filter.bedrooms = Number(req.query.bedrooms);
    }

    if (req.query.bathrooms) {
      filter.bathrooms = Number(req.query.bathrooms);
    }

    // 🔃 Sorting
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === "desc" ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.createdAt = -1; // default newest first
    }

    // 📦 Query DB
    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sort).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);

    res.json({
      data: properties,
      meta: { total, page, limit },
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
