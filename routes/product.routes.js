let express = require("express");
let router = express.Router();
let { auth } = require("../Middleware/auth.middleware.js");
const upload = require("../utils/multer.utils.js");
let {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addVariant,
  deleteVariant,
  updateVariant,
} = require("../controller/product.controller.js");

//Protect
router.use(auth);

//EndPoints
router
  .route("/")
  .post(upload.single("image"), createProduct)
  .get(getAllProducts);
router
  .route("/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

router.post(
  "/:id/variants",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addVariant
);
router.delete("/:id/variants/:variantId", deleteVariant);
router.patch(
  "/:id/variants/:variantId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateVariant
);

module.exports = router;
