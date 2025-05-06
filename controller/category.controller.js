const Category = require("../models/category.model.js");
const catchAsync = require("../utils/catchAsync.utils");
const QueryFeatures = require("../utils/queryFeatures.utils.js");

exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create({
    image: req.file?.path,
    name: req.body.name,
    description: req.body.description,
    subcategoriesId: req.body.subcategoriesId
      ? JSON.parse(req.body.subcategoriesId)
      : [],
  });

  res.status(201).json(category);
});

exports.getAllCategories = catchAsync(async (req, res) => {
  const totalCount = await Category.countDocuments();
  const features = new QueryFeatures(Category.find().populate('subcategoriesId'), req.query)
    .search()
    .filter()
    .paginate();
  const categories = await features.query;

  res.status(200).json({
    message: "All categories",
    totalCount,
    results: categories.length,
    categories,
  });
});


exports.getCategoryById = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "subcategoriesId"
  );
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.status(200).json(category);
});

exports.updateCategory = catchAsync(async (req, res) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedCategory);
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
