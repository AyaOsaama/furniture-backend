const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: { type: String },

    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },

    description: {
      en: { type: String, maxlength: 255 },
      ar: { type: String, maxlength: 255 },
    },

    content: {
      en: { type: String },
      ar: { type: String },
    },

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
