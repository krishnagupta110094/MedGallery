const imagekit = require("../config/imagekit");
const CategoryModel = require("../models/category.model");
const FileModel = require("../models/file.model");

const uploadFile = async (req, res) => {
  try {
    const { title, categoryId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // 🔥 Upload to ImageKit
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + "-" + req.file.originalname,
      folder: "medivault",
    });

    // 💾 Save in DB
    const newFile = await FileModel.create({
      title,
      category: categoryId,
      fileUrl: result.url,
      fileId: result.fileId,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newFile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 DB se file find kar
    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ☁️ ImageKit se delete
    await imagekit.deleteFile(file.fileId);

    // 🗑 DB se delete
    await FileModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPreviewFiles = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    // 🧠 har category ke liye top 5 files
    const result = await Promise.all(
      categories.map(async (cat) => {
        const files = await FileModel.find({ category: cat._id })
          .sort({ createdAt: -1 })
          .limit(4);

        return {
          category: cat.name,
          categoryId: cat._id,
          files,
        };
      }),
    );

    res.json({
      success: true,
      message: "Files fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getFilesByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const files = await FileModel.find({ category })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Files fetched successfully",
      count: files.length,
      data: files,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/files
// Returns all files grouped by category
const getAllFilesForAdmin = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await CategoryModel.find();

    // Fetch files for all categories in parallel
    const filesByCategory = await Promise.all(
      categories.map(async (cat) => {
        const files = await FileModel.find({ category: cat._id });

        return {
          categoryId: cat._id,
          category: cat.name,
          files: files.map((f) => ({
            _id: f._id,
            title: f.title,
            fileUrl: f.fileUrl,
            category: cat._id,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
          })),
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files: filesByCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching files",
      error: err.message,
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getPreviewFiles,
  getFilesByCategory,
  getAllFilesForAdmin,
};
