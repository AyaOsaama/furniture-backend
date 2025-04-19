const express = require("express");
const router = express.Router();
const ratingController = require("../controller/rating.controller.js");

router.post("/", ratingController.createRating);
router.get("/", ratingController.getAllRatings);
router.get("/:id", ratingController.getRatingById);
router.delete("/:id", ratingController.deleteRating);

module.exports = router;
