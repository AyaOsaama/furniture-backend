const express = require("express");
const router = express.Router();
const {
  createRating,
  getAllRatings,
  getRatingById,
  deleteRating,
} = require("../controller/rating.controller.js");

router.post("/", createRating);
router.get("/", getAllRatings);
router.get("/:id", getRatingById);
router.delete("/:id", deleteRating);

module.exports = router;
