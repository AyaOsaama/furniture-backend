const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: { type: String },
    title: { type: String, required: true },
    description: { type: String, maxlength: 255 },
    content: { type: String },
    like: { type: Number, default: 0 },
    author: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
