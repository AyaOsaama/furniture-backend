const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: { type: String },
    title: { type: String, required: true },
    description: { type: String, maxlength: 255 },
    content: { type: String },
    author: { type: String },

    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
      },
    ],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
