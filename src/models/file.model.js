const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    title: String,
    fileUrl: String,
    fileId: String, // ImageKit id (delete ke liye useful)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true },
);

const FileModel = mongoose.model("File", fileSchema);

module.exports = FileModel;
