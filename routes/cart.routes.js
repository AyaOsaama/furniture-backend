let express = require("express");
let router = express.Router();
const { auth } = require("../middleware/auth.middleware");

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
