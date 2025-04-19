const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subcategoryId: { type: String, required: true, unique: true },
    categoriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
