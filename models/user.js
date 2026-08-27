const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 1. REMOVE THE CURLY BRACES HERE:
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
});

// 2. This will now receive the actual function and work perfectly!
userSchema.plugin(passportLocalMongoose.default ||passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
