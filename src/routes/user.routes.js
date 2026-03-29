const express = require("express");
const { getCategories } = require("../controllers/category.controller");
const {
  getPreviewFiles,
  getFilesByCategory,
} = require("../controllers/file.controller");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/files/preview", getPreviewFiles);
router.get("/files", getFilesByCategory);

module.exports = router;
