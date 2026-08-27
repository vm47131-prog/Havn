const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
  rating:{
    type:Number,
    min:1,
    max:5
  },
  comment:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now(),
  },  
  author:{
    type:Schema.Types.ObjectId,
     ref:"User",//This acts as a pointer or a "foreign key". It tells Mongoose that the ID stored in this field belongs to a document inside the User model.
  },
});
module.exports=mongoose.model("Review",reviewSchema);