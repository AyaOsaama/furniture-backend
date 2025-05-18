const express = require("express");
const router = express.Router();
let { auth } = require("../Middleware/auth.middleware");

const {
  addToCart,
  getCartByUser,
  updateCartProduct,
  deleteCartProduct,
  clearCart,
  getLastProduct,
  getSuggestedProducts,
} = require("../controller/cart.controller.js");

router.use(auth); 

// Existing endpoints
router.post("/", addToCart);
router.get("/", getCartByUser);
router.delete("/clear", clearCart);
// ** جلب آخر منتج مضاف **
router.get("/last-product/:userId", getLastProduct);

// ** جلب المنتجات المقترحة بناء على الفئة **
router.get("/suggested/:categoryId", getSuggestedProducts);

router.patch("/:cartProductId", updateCartProduct);
router.delete("/:cartProductId", deleteCartProduct);



module.exports = router;
