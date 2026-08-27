const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
   let {id}=req.params;
   let listing=await Listing.findById(id);
   let newReview=new Review(req.body.review);
   newReview.author=req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   console.log("new review saved");
   res.redirect(`/listings/${listing._id}`); 
};
module.exports.destroyReview=async(req,res)=>{ // "/:reviewId" =>child route
   let{id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//$pull=>listing ke reviews array me se reviewId ko pull karo and delete
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted !");
   res.redirect(`/listings/${id}`);
  };