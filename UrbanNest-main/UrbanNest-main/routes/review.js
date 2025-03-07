const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;