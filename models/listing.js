const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Trending",
      "Rooms",
      "Iconic-Cities",
      "Mountains",
      "Castles",
      "Amazing-Pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
    default: "Trending",
  },
});
// mangoose Middleware(Hook)
listingSchema.post("findOneAndDelete", async (listing) => {
  // (listing) isme us listing ka data ayega jisko delete karna hai
  if (listing) {
    //findOneAndDelete=>As a Middleware Hook
    await Review.deleteMany({ _id: { $in: listing.reviews } }); //given id ke inside ko access karne ke liye
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
