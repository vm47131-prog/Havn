const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");
const Groq = require("groq-sdk");

maptilerClient.config.apiKey = process.env.MAP_TOCKEN;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not Exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  //   console.log(url, "..", filename);
  let { title, description, category, image, price, location, country } =
    req.body;
  //   console.log(req.body);

  let samplelisting = new Listing({
    title: title,
    description: description,
    category: category,
    image: {
      filename: filename,
      url: url,
    },
    price: price,
    location: location,
    country: country,
  });
  samplelisting.owner = req.user._id; //user=> current loggedin user
  try {
    const result = await maptilerClient.geocoding.forward(location);
    samplelisting.geometry = result.features[0].geometry;
  } catch (error) {
    console.log(error);
    return res.send("Wrong entered address");
  }
  await samplelisting.save();
  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250"); ///h_300,w_250 ka matlab hai Image Transformation Parameters.
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
  if (!req.body) {
    // custom error message
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let { title, description, category, price, location, country } = req.body;
  let samplelisting = {
    title: title,
    description: description,
    catogry: catogry,
    // image: {
    //   filename: filename,
    //   url: url,
    // },
    price: price,
    location: location,
    country: country,
  };
  let listing = await Listing.findByIdAndUpdate(id, samplelisting, {
    new: true, //Yeh database mein update karne ke baad, jo naya aur fresh data save hua hai, usey listing variable mein return karta hai.
  }); //Update the changed things and not changed remain as it is
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { filename, url };
    await listing.save();
  }
  req.flash("success", "Listing Updated !");
  console.log(listing);
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
};
module.exports.searchListing = async (req, res) => {
  let cname = req.query.country; //send country name
  let allListings = await Listing.find({ country: cname });
  res.render("listings/index.ejs", { allListings });
};
module.exports.filterByCategory = async (req, res) => {
  let { category } = req.params;
  console.log("Category:", category);
  let allListings = await Listing.find({
    category: category,
  });
  res.render("listings/index.ejs", { allListings });
};
module.exports.enhance_description = async (req, res) => {
  try {
    const { description } = req.body;

    console.log("Description received:", description);

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: "Description is required",
      });
    }

    if (description.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "Description is too long",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an expert travel and Airbnb-style listing description writer.

Improve the user's description.

Rules:
-In very easy english.
- Keep the original meaning.
- Make it attractive and professional.
- Keep it natural and easy to read.
- Do not invent facilities or amenities.
- Do not invent prices.
- Do not invent distances.
- Do not invent ratings.
- Do not add false claims.
- Keep it concise.
- Return ONLY the improved description.
`,
        },
        {
          role: "user",
          content: description,
        },
      ],

      max_tokens: 300,
    });

    const enhancedDescription = completion.choices[0].message.content.trim();

    console.log("AI RESULT:", enhancedDescription);

    res.json({
      success: true,
      enhanced: enhancedDescription,
    });
  } catch (error) {
    console.error("========== GROQ ERROR ==========");
    console.error("STATUS:", error.status);
    console.error("MESSAGE:", error.message);
    console.error("ERROR:", error);
    console.error("================================");

    res.status(500).json({
      success: false,
      error: error.message || "Unable to enhance description",
    });
  }
};
