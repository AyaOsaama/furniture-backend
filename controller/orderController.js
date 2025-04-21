const orderModel =require('../models/orderModels')
const cartModel =require('../models/cartModels')
const ProductModel = require('../models/productModels')
const ApiError = require('../utils/ApiError');
const { catchAsync } = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    const cartItems = await cartModel.find({ userId });

    if (cartItems.length === 0) {
        return next(new ApiError(400, 'Cart is empty'));
    }

    const products = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtAddition
    }));

    const order = await orderModel.create({
        userId,
        products,
        shippingAddress,
        paymentMethod
    });

    await cartModel.deleteMany({ userId });

    res.status(201).json({ message: 'Order placed successfully', order });
    // update in_stock
    for (let item of cartItems) {
        const product = await ProductModel.findById(item.productId);
        if (!product) return next(new ApiError(404, 'Product not found'));
    
        if (item.quantity > product.inStock) {
            return next(new ApiError(400, `Insufficient stock for ${product.name}`));
        }
    
        product.inStock -= item.quantity;
        await product.save();
    }
    
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await orderModel.find({ userId: req.user._id });
    const orderCount = orders.length;
  
    res.status(200).json({ orderCount, orders });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
    const order = await orderModel.findById(req.params.orderId);
    if (!order) return next(new ApiError(404, 'Order not found'));
    res.status(200).json({ order });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status, paymentStatus } = req.body;

    const order = await orderModel.findById(req.params.orderId);
    if (!order) return next(new ApiError(404, 'Order not found'));

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ message: 'Order updated', order });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await orderModel.find();
    res.status(200).json({ orders });
});