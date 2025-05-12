const Rating = require("../models/rating.model.js");
const catchAsync = require("../utils/catchAsync.utils");
const QueryFeatures = require("../utils/queryFeatures.utils.js");
const Product = require('../models/product.models.js'); 

exports.createRating = catchAsync(async (req, res) => {
  const newRating = await Rating.create(req.body);

  const ratings = await Rating.find({ productId: newRating.productId });

  const ratingCount = ratings.length;

  const averageRating =
    ratings.reduce((acc, r) => acc + r.value, 0) / ratingCount;

  await Product.findByIdAndUpdate(newRating.productId, {
    averageRating,
    ratingCount,
  });

  res.status(201).json({
    message: 'Rating created and product updated',
    rating: newRating,
  });
});


exports.getAllRatings = catchAsync(async (req, res) => {
  const totalCount = await Rating.countDocuments();

  const features = new QueryFeatures(
    Rating.find().populate('userId', 'name email') 
                .populate('productId', 'variants description brand'), 
    req.query
  )
    .search()
    .filter();
    // .paginate();

  const ratings = await features.query;

  res.status(200).json({
    message: "All ratings",
    totalCount,
    results: ratings.length,
    ratings,
  });
});

exports.getRatingById = catchAsync(async (req, res) => {
  const rating = await Rating.findById(req.params.id)
    .populate('userId', 'name email') 
    .populate('productId', 'variants description brand');

  if (!rating)
    return res.status(404).json({ message: "Rating not found" });

  res.status(200).json(rating);
});


exports.deleteRating = catchAsync(async (req, res) => {
  await Rating.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
