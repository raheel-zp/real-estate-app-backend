const User = require("../models/User");

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    console.log(req.user.id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.propertyId)) {
      user.favorites.push(req.params.propertyId);
      await user.save();
    }

    await user.populate("favorites");

    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.propertyId
    );
    await user.save();

    await user.populate("favorites");

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
