const express = require("express");
const {
  validateCategory,
  validateFileUpload,
} = require("../middlewares/validate.middleware");
const { createCategory } = require("../controllers/category.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../config/upload");
const {
  uploadFile,
  deleteFile,
  getAllFilesForAdmin,
} = require("../controllers/file.controller");
const router = express.Router();

router.post("/categories", auth(["admin"]), validateCategory, createCategory);
router.get("/files", auth(["admin"]), getAllFilesForAdmin);
router.post(
  "/files",
  auth(["admin"]),
  upload.single("file"), // 🔥 multer
  validateFileUpload,
  uploadFile,
);
router.delete("/files/:id", auth(["admin"]), deleteFile);

module.exports = router;
