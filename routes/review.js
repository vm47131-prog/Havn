const express=require("express");
const router=express.Router({mergeParams:true});//to preserve the path parameters (req.params) from the parent router when you split your routes into separate files.
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js"); 
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js"); 
//Reviews
 //Post Route
 router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
// Delete Review Route
  router.delete("/:reviewId",isreviewAuthor,wrapAsync(reviewController.destroyReview));
   module.exports=router;