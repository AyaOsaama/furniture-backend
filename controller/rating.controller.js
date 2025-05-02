const Rating = require("../models/rating.model.js");
const catchAsync = require("../utils/catchAsync.utils");
const QueryFeatures = require("../utils/queryFeatures.utils.js");

exports.createRating = catchAsync(async (req, res) => {
  const rating = await Rating.create(req.body);
  res.status(201).json(rating);
});

exports.getAllRatings = catchAsync(async (req, res) => {
  const totalCount = await Rating.countDocuments();
  const features = new QueryFeatures(Rating.find(), req.query)
    .search()
    .filter()
    .paginate();
  const ratings = await features.query;
  res.status(200).json({
    message: "All ratings",
    totalCount,
    results: ratings.length,
    ratings,
  });
});

exports.getRatingById = catchAsync(async (req, res) => {
  const rating = await Rating.findById(req.params.id);
  if (!rating) return res.status(404).json({ message: "Rating not found" });
  res.status(200).json(rating);
});

exports.deleteRating = catchAsync(async (req, res) => {
  await Rating.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
