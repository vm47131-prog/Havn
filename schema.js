const joi = require("joi");
((module.exports.listingSchema = joi
  .object({
    // backend error validation
    //   listing:joi.object({// not requred as form input is not in form of object , if object then we use
    title: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().required(),
    image: joi.string().allow("", null), //alowing empty and null values
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
  })
  .required()),
  (module.exports.reviewSchema = joi.object({
    review: joi
      .object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required(),
      })
      .required(),
  })));
