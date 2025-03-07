const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const{storage} = require("../cloudConfig.js");
const upload = multer({storage}) ;

router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing)); //post new route

//get newForm route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //get routes --> for displaying pages
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) //edit route
    .delete(isOwner,isLoggedIn,wrapAsync(listingController.deleteListing)); //delete route

router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm));
router.get("/category/:filter",wrapAsync(listingController.showCategory));
router.post("/search",wrapAsync(listingController.searchListing))

module.exports = router;