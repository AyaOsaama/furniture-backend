const mongoose = require("mongoose");
const Post = require("../models/post.model.js");
const catchAsync = require("../utils/catchAsync.utils");
const QueryFeatures = require("../utils/queryFeatures.utils.js");

exports.createPost = catchAsync(async (req, res) => {
  const post = await Post.create({
    image: req.file.path,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    author: req.body.author,
  });

  res.status(201).json(post);
});

exports.getAllPosts = catchAsync(async (req, res) => {
  const totalCount = await Post.countDocuments();
  const features = new QueryFeatures(Post.find(), req.query)
    .search()
    .filter()
    .paginate();

  const posts = await features.query
    .populate("likes.user", "userName email image")
    .populate("comments.user", "userName email image");

  res.status(200).json({
    message: "All posts",
    totalCount,
    results: posts.length,
    posts,
  });
});

exports.getPostById = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("likes.user", "userName email image")
    .populate("comments.user", "userName email image");

  if (!post) return res.status(404).json({ message: "Post not found" });
  res.status(200).json(post);
});

exports.updatePost = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;  
  }

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
});


exports.deletePost = catchAsync(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// like/unlike toggle post
exports.likePost = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.id);

  const likeIndex = post.likes.findIndex(
    (like) => like.user.toString() === userId
  );

  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
    await post.save();
    return res.status(200).json({ message: "Post unliked successfully" });
  }

  post.likes.push({ user: mongoose.Types.ObjectId(userId) });
  await post.save();
  res.status(200).json({ message: "Post liked successfully" });
});

// add comment
exports.commentPost = catchAsync(async (req, res) => {
  const { userId, comment } = req.body;
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: mongoose.Types.ObjectId(userId),
    comment,
  });
  await post.save();

  res.status(200).json({ message: "Comment added successfully" });
});

// delete comment
exports.deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const post = await Post.findById(req.params.id);

  const initialLength = post.comments.length;
  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );

  if (post.comments.length === initialLength) {
    return res.status(404).json({ message: "Comment not found" });
  }

  await post.save();
  res.status(200).json({ message: "Comment deleted successfully" });
});
