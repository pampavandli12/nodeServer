var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var TokenList = new Schema(
  { RefreshToken: String },
  { collection: "TokenList" }
);
module.exports = mongoose.model("TokenList", TokenList);
