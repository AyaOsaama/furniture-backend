const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoriesId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
