const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

const isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You need to be logged in to create or access listings");
        res.redirect("/login");
    }
    next();
}
const saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const isOwner = async (req,res,next) => {
    let {id} = req.params;
    let currListing = await Listing.findById(id);
    if(res.locals.currUser && !currListing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You aren't owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    let currReview = await review.findById(reviewId);
    if(res.locals.currUser && !currReview.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You aren't author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//validate listing on server side using Joi in schema.js
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
}

//validate review on server side using Joi in schema.js
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
}

module.exports = {isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview,isReviewAuthor};