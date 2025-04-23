const Post = require("../models/post.model.js");
const catchAsync = require("../utils/catchAsync.utils");

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

//  like/unlike toggle post
exports.likePost = catchAsync(async (req, res) => {
  const { userId, username } = req.body;
  const post = await Post.findById(req.params.id);

  const likeIndex = post.likes.findIndex(
    (like) => like.user.toString() === userId
  );

  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
    await post.save();
    return res.status(200).json({ message: "Post unliked successfully" });
  }

  post.likes.push({ user: userId, username });
  await post.save();
  res.status(200).json({ message: "Post liked successfully" });
});

// add comment
exports.commentPost = catchAsync(async (req, res) => {
  const { userId, username, comment } = req.body;
  const post = await Post.findById(req.params.id);

  post.comments.push({ user: userId, username, comment });
  await post.save();

  res.status(200).json({ message: "Comment added successfully" });
});

// delete comment
exports.deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const post = await Post.findById(req.params.id);

  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );
  if (commentId === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  post.comments.splice(commentId, 1);
  await post.save();

  res.status(200).json({ message: "Comment deleted successfully" });
});
