const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
    comment: {
      en: { type: String },
      ar: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
