let express = require("express");
let router = express.Router();
let {
  auth,
  restrictTo,
  validateChangePasswordInput,
} = require("../Middleware/auth.middleware.js");
let {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
  changePassword,
  updateMe,
} = require("../controller/user.controller.js");
const upload = require("../utils/multer.utils.js");

// Protect all routes below
router.use(auth);

// Endpoints

router.patch("/me", upload.single("image"), updateMe);

router.route("/").get(restrictTo("admin", "super_admin"), getAllUser);

router.patch("/changePassword", validateChangePasswordInput, changePassword);

router
  .route("/:id")
  .get(getUserById)
  .delete(restrictTo("admin", "super_admin"), deleteUserById)
  .patch(upload.single("image"), restrictTo("admin", "super_admin"), updateUserById);

module.exports = router;
