const ProductModel = require("../models/product.models.js");
const ApiError = require("../utils/ApiError.utils.js");
const catchAsync = require("../utils/catchAsync.utils.js");
const QueryFeatures = require("../utils/queryFeatures.utils.js");
const { uploadBufferToCloudinary } = require("../utils/cloudinary.utils.js");


exports.createProduct = catchAsync(async (req, res, next) => {
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);

  const { brand, categories, description, material, variants } = req.body;

  const parsedCategories = categories ? JSON.parse(categories) : { main: '', sub: '' };
  const parsedDescription = description ? JSON.parse(description) : { en: '', ar: '' };
  const parsedMaterial = material ? JSON.parse(material) : { en: '', ar: '' };
  const parsedVariants = variants ? JSON.parse(variants) : [];

  if (!Array.isArray(parsedVariants)) {
    return next(new ApiError('Variants must be an array', 400));
  }

  const mainVariantImage = req.files?.variantImage?.[0]
  ? await uploadBufferToCloudinary(req.files.variantImage[0].buffer)
  : null;

const additionalVariantImages = req.files?.variantImages?.length > 0
  ? await Promise.all(req.files.variantImages.map(file => uploadBufferToCloudinary(file.buffer)))
  : [];

if (parsedVariants.length > 0) {
  parsedVariants[0].image = mainVariantImage;
  parsedVariants[0].images = additionalVariantImages;
}


   const newProductModel= new ProductModel({
    brand,
    categories: parsedCategories,
    description: parsedDescription,
    material: parsedMaterial,
   variants: parsedVariants
    })
    const newProduct = await newProductModel.save();
  res.status(201).json({
    message: "Product created successfully",
    product: newProduct
  });

});


exports.getAllProducts = catchAsync(async (req, res, next) => {
  const totalCount = await ProductModel.countDocuments();
  const features = new QueryFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    // .paginate();
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

  // Parse values from req.body
  const {
    price,
    discountPrice,
    material,
    description,
    ...rest
  } = req.body;

  const parsedMaterial = material ? JSON.parse(material) : { en: '', ar: '' };
  const parsedDescription = description ? JSON.parse(description) : { en: '', ar: '' };

  if (discountPrice && discountPrice >= price) {
    return next(new ApiError(400, "Discount price must be less than the actual price"));
  }

  let image = null;
  if (req.files?.image?.[0]) {
    image = await uploadBufferToCloudinary(req.files.image[0].buffer);
  }

  let images = [];
  if (req.files?.images?.length > 0) {
    images = await Promise.all(
      req.files.images.map(file => uploadBufferToCloudinary(file.buffer))
    );
  }

  product.variants.push({
    ...rest,
    price,
    discountPrice,
    material: parsedMaterial,
    description: parsedDescription,
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

  const {
    price,
    discountPrice,
    material,
    description,
    ...rest
  } = req.body;

  const parsedMaterial = material ? JSON.parse(material) : variant.material;
  const parsedDescription = description ? JSON.parse(description) : variant.description;

  const updated = {
    ...variant.toObject(),
    ...rest,
    price,
    discountPrice,
    material: parsedMaterial,
    description: parsedDescription,
  };

  if (updated.discountPrice && updated.discountPrice >= updated.price) {
    return next(new ApiError(400, "Discount price must be less than the actual price"));
  }

  if (req.files?.image?.[0]) {
    updated.image = await uploadBufferToCloudinary(req.files.image[0].buffer);
  }

  if (req.files?.images?.length > 0) {
    updated.images = await Promise.all(
      req.files.images.map(file => uploadBufferToCloudinary(file.buffer))
    );
  }

  Object.assign(variant, updated);
  await product.save();

  res.status(200).json({ message: "Variant updated", product });
});




