const Post = require("../models/post.model.js");
const catchAsync = require("../utils/catchAsync.utils.js");

exports.createPost = catchAsync(async (req, res) => {
  const post = await Post.create({
    image: req.file.path,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    like: req.body.like,
    author: req.body.author,
  });

  res.status(201).json(post);
});

exports.getAllPosts = catchAsync(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

exports.getPostById = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.status(200).json(post);
});

exports.updatePost = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(post);
});

exports.deletePost = catchAsync(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
