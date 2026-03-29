const CategoryModel = require("../models/category.model");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await CategoryModel.create({ name });

    res.json({ message: "Category created successfully", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.json({ message: "Categories fetched successfully", categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
