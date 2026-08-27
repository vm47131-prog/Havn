if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const maptilerClient = require("@maptiler/client");
// Configure your token key credentials
maptilerClient.config.apiKey = process.env.MAP_TOKEN;
const dbUrl = process.env.ATLASDB_URL; //connecting with atlas cloud database
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});
const sessionOptions = {
  store: store, //OR store
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
//implimenting passport   using local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // It contains the pre-written background logic that looks up the user in the database, extracts their encrypted password hash/salt, and verifies it against the password they typed.

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//This custom middleware runs on every incoming request before hitting your actual routes
//In Express.js, res.locals is a built-in object used to store variables that are local to a specific request
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  //console.log(res.locals.success);
  next();
});
// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta_student"
//   });
//   let registeredUser=await User.register(fakeUser,"helloworld");//
//    res.send(registeredUser);
// }); //register method automatically check kar lega vo username unique hai ya nahi
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); ///listings/:id/reviews => parent route
app.use("/", userRouter);

app.get("/listingsmap/:id/", async (req, res) => {
  try {
    // 1. Imagine retrieving a text address record string from your Mongo database structure
    const listingAddress = "New Delhi, India";

    // 2. Call MapTiler's Geocoding API server-side to look up coordinate properties
    const geoResult = await maptilerClient.geocoding.forward(listingAddress, {
      limit: 1,
    });

    // 3. Build your project data object model framework
    const listingData = {
      title: "My Major Project Listing Destination Location",
      // Fallback to New Delhi default array parameters if search fails
      geometry:
        geoResult.features.length > 0
          ? geoResult.features[0].geometry
          : { type: "Point", coordinates: [77.209, 28.6139] },
    };

    // 4. Send the resolved payload object into your show template engine view
    res.render("show", { listing: listingData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error processing location metrics.");
  }
});
// Error handling
app.all("{*path}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "some error Occured" } = err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("server is listining to port 8080");
});
