const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // Multer cloudinary ke storage me image ko store karega

router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewForm) //new Route
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing),
  ); //insert route

router.route("/search").get(wrapAsync(listingController.searchListing));
//groq api
router
  .route("/enhance-description")
  .post(wrapAsync(listingController.enhance_description));

router
  .route("/search/:category")
  .get(wrapAsync(listingController.filterByCategory));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //delete route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing),
  ); //update route

//Index Route
router.get("/", wrapAsync(listingController.index));
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
