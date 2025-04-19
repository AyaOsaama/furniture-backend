const Category = require("../models/category.model.js");
const catchAsync = require("../utils/catchAsync.utils.js");

exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().populate("subcategoriesId");
  res.status(200).json(categories);
});

exports.getCategoryById = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "subcategoriesId"
  );
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.status(200).json(category);
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(category);
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
