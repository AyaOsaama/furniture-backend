let express = require("express");
let router = express.Router();
let { auth, restrictTo } = require("../Middleware/auth.middleware");
let {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controller/order.controller.js");

//Protect
router.use(auth);

//EndPoints
router.get("/all" , restrictTo("super_admin","admin"),getAllOrders);
router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId", restrictTo("super_admin", "admin"),updateOrderStatus);



module.exports = router;
