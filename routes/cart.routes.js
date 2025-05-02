let express = require("express");
let router = express.Router();
const { auth } = require("../Middleware/auth.middleware.js");

let {
  addToCart,
  getCartByUser,
  updateCartProduct,
  deleteCartProduct,
  clearCart,
} = require("../controller/cart.controller.js");

//Protect
router.use(auth);

//EndPoints
router.post("/", addToCart);
router.get("/", getCartByUser);
router.patch("/:cartProductId", updateCartProduct);
router.delete("/:cartProductId", deleteCartProduct);
router.delete("/clear", clearCart);

module.exports = router;
