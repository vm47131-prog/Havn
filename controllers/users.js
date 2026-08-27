const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.userSingnUp = async (req, res, next) => {
  //wrapAsync to handle error if erro then it redirect to a new page but we want if error then redirect to same login page with a flash message=> we use try catch
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      //how to automatically log a user in immediately after they sign up, so they don't have to type their password again.
      if (err) return next(err);
      req.flash("success", "Welcome to Havn!");
      res.redirect("/listings");
    });
  } catch (e) {
    //catching the error
    console.log(e.message);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.userLogin = async (req, res) => {
  req.flash("success", "Welcome to Havn!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
module.exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};
