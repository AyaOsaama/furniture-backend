const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true, unique: true },
    subcategoriesId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    ],
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
