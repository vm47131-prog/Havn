const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
  //req.path =>ye relative path ko deta hai jis path se request aya hai
  //req.originalUrl =>ye original url deta hai
  //console.log(req.path,"..",req.originalUrl);
  //console.log(req.user);//use to check whether user is loggedin or not
  if (!req.isAuthenticated()) {
    // if(req.user)=>  user alraedy then show only logout option
    req.session.redirectUrl = req.originalUrl; //It is creating a variable named redirectUrl and storing it inside the Session memory on the server.
    req.flash("error", "You must be Logged in to do changes listing!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to make changes.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  //  Agar req.body hi nahi mili, toh code ko 'review' read karne se pehle hi rok dein
  if (!req.body) {
    throw new ExpressError(
      400,
      "Express urlencoded middleware properly kaam nahi kar raha hai ya body missing hai!",
    );
  }
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); //details is array of errors
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params; //id=reviewId
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to make changes.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
