const ProductModel = require("../models/product.models.js");
const ApiError = require("../utils/ApiError.utils.js");
const catchAsync = require("../utils/catchAsync.utils.js");
const QueryFeatures = require("../utils/queryFeatures.utils.js");

exports.createProduct = catchAsync(async (req, res, next) => {
  let product = await ProductModel.create(req.body);
  res.status(201).json({ message: "added new product success", product });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const totalCount = await ProductModel.countDocuments();
  const features = new QueryFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    .paginate();
  const products = await features.query.populate(
    "categories.main categories.sub",
    "-name"
  );

  res.status(200).json({
    message: "All products",
    totalCount,
    results: products.length,
    products,
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id).populate(
    "categories.main categories.sub",
    "-name"
  );
  if (!product) return next(new ApiError(404, "Product not found"));
  res.status(200).json({ message: "success", product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) return next(new ApiError(404, "Product not found"));
  res.status(200).json({ message: "Product updated", product });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (!product) return next(new ApiError(404, "Product not found"));
  res.status(200).json({ message: "Product deleted" });
});

exports.addVariant = catchAsync(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return next(new ApiError(404, "Product not found"));

  const { price, discountPrice, ...rest } = req.body;

  if (discountPrice && discountPrice >= price) {
    return next(
      new ApiError(400, "Discount price must be less than the actual price")
    );
  }

  const image = req.files?.image?.[0]?.path;
  const images = req.files?.images?.map((img) => img.path) || [];

  product.variants.push({
    ...rest,
    price,
    discountPrice,
    image,
    images,
  });

  await product.save();

  res.status(200).json({ message: "Variant added", product });
});

exports.deleteVariant = catchAsync(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return next(new ApiError(404, "Product not found"));

  const variantId = req.params.variantId;
  const variant = product.variants.id(variantId);
  if (!variant) return next(new ApiError(404, "Variant not found"));

  variant.remove();
  await product.save();

  res.status(200).json({ message: "Variant deleted", product });
});

exports.updateVariant = catchAsync(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return next(new ApiError(404, "Product not found"));

  const variant = product.variants.id(req.params.variantId);
  if (!variant) return next(new ApiError(404, "Variant not found"));

  const updated = { ...variant.toObject(), ...req.body };

  if (updated.discountPrice && updated.discountPrice >= updated.price) {
    return next(
      new ApiError(400, "Discount price must be less than the actual price")
    );
  }

  if (req.files?.image?.[0]) {
    updated.image = req.files.image[0].path;
  }

  if (req.files?.images?.length > 0) {
    updated.images = req.files.images.map((img) => img.path);
  }

  Object.assign(variant, updated);
  await product.save();

  res.status(200).json({ message: "Variant updated", product });
});
