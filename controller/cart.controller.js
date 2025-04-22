const cartModel = require("../models/cart.models.js");
const ProductModel = require("../models/product.models.js");
const ApiError = require("../utils/ApiError.utils.js");
const catchAsync = require("../utils/catchAsync.utils");

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity, priceAtAddition } = req.body;
  const userId = req.user._id;

  const product = await ProductModel.findById(productId);
  if (!product) return next(new ApiError(404, "Product not found"));

  if (quantity > product.inStock) {
    return next(new ApiError(400, "Not enough stock available"));
  }

  let existingItem = await cartModel.findOne({ userId, productId });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
    return res
      .status(200)
      .json({ message: "Cart item updated", item: existingItem });
  }

  const cartItem = await cartModel.create({
    productId,
    quantity,
    userId,
    priceAtAddition,
  });

  res.status(201).json({ message: "Item added to cart", item: cartItem });
});

exports.getCartByUser = catchAsync(async (req, res, next) => {
  const cart = await cartModel
    .find({ userId: req.user._id })
    .populate("productId");
  res.status(200).json({ cart });
});

exports.updateCartProduct = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const cartProduct = await cartModel.findByIdAndUpdate(
    req.params.cartProductId,
    { quantity },
    { new: true, runValidators: true }
  );

  if (!cartProduct) return next(new ApiError(404, "Cart item not found"));

  res.status(200).json({ message: "Cart item updated", cartProduct });
});

exports.deleteCartProduct = catchAsync(async (req, res, next) => {
  const deleted = await cartModel.findByIdAndDelete(req.params.cartProductId);
  if (!deleted) return next(new ApiError(404, "Cart item not found"));
  res.status(200).json({ message: "Cart item removed" });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  await cartModel.deleteMany({ userId: req.user._id });
  res.status(200).json({ message: "Cart cleared" });
});
