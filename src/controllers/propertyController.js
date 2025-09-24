const Property = require("../models/Property");
const { v4: uuidv4 } = require("uuid");

exports.getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

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

    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === "desc" ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort.createdAt = -1;
    }

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

exports.createProperty = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    const imagePaths = req.files
      ? req.files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        )
      : [];
    const mysqlId = uuidv4();

    const property = new Property({
      mysqlId,
      title,
      description,
      price,
      location,
      images: imagePaths,
      createdBy: req.user.id,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    let images = property.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }
    console.log(req.body);
    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.price = req.body.price || property.price;
    property.location = req.body.location || property.location;
    property.images = images;

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
