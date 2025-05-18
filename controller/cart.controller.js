const cartModel = require("../models/cart.models.js");
const ProductModel = require("../models/product.models.js");
const ApiError = require("../utils/ApiError.utils.js");
const catchAsync = require("../utils/catchAsync.utils");

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  // const userId = req.user ? req.user._id : req.body.userId;
  const userId = req.user._id ;
  console.log(`user Id in add cart: `,userId);
  


  const product = await ProductModel.findById(productId);
  if (!product) return next(new ApiError(404, "Product not found"));

 const variant = product.variants?.[0];
if (!variant) return next(new ApiError(400, "No variant available for this product"));

if (quantity > variant.inStock) {
  return next(new ApiError(400, "Not enough stock available"));
}

const finalPrice = (typeof variant.discountPrice === "number" && variant.discountPrice > 0)
  ? variant.discountPrice
  : variant.price;

if (!finalPrice || finalPrice <= 0) {
  return next(new ApiError(400, "Invalid price for product variant"));
}

console.log("finalPrice", finalPrice);


  let existingItem = await cartModel.findOne({ userId, productId });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
    return res.status(200).json({ message: "Cart item updated", item: existingItem });
  }

  const cartItem = await cartModel.create({
    productId,
    quantity,
    userId,
    priceAtAddition: finalPrice, 
  });

  res.status(201).json({ message: "Item added to cart", item: cartItem });
});



exports.getCartByUser = catchAsync(async (req, res, next) => {
  // const userId = req.user?._id || req.query.userId || req.body.userId || req.params.userId;
 console.log("GET /carts called");
  console.log("Headers:", req.headers);

  const userId = req.user._id;
  console.log("User ID:", userId);

  const cartItems = await cartModel.find({ userId }).populate("productId");
  res.json({ cart: cartItems });
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
  const userId = req.user ? req.user._id : req.body.userId;
  // const userId = req.user ? req.user._id : req.query.userId;

  await cartModel.deleteMany({ userId });
  res.status(200).json({ message: "Cart cleared" });
});


exports.getLastProduct = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const lastCartItem = await cartModel
    .findOne({ userId })
    .sort({ createdAt: -1 })
    .populate("productId");
  if (!lastCartItem) return res.status(404).json({ message: "No products in cart" });
  res.json(lastCartItem.productId);
});

exports.getSuggestedProducts = catchAsync(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  console.log("Main Category ID:", categoryId);

  const products = await ProductModel.find({ "categories.main": categoryId }).limit(3);
  res.json(products);
});



