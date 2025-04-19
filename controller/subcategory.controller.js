const Subcategory = require("../models/subcategory.model.js");
const catchAsync = require("../utils/catchAsync.utils.js");

exports.createSubcategory = catchAsync(async (req, res) => {
  const subcategory = await Subcategory.create(req.body);
  res.status(201).json(subcategory);
});

exports.getAllSubcategories = catchAsync(async (req, res) => {
  const subcategories = await Subcategory.find().populate("categoriesId");
  res.status(200).json(subcategories);
});

exports.getSubcategoryById = catchAsync(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id).populate(
    "categoriesId"
  );
  if (!subcategory)
    return res.status(404).json({ message: "Subcategory not found" });
  res.status(200).json(subcategory);
});

exports.updateSubcategory = catchAsync(async (req, res) => {
  const subcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(subcategory);
});

exports.deleteSubcategory = catchAsync(async (req, res) => {
  await Subcategory.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
