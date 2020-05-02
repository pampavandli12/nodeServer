var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var tasklist = new Schema({
    username: String,
    userID: String,
    headline:String,
    description:String,
    date:String
}, { collection: "tasklist" });
module.exports = mongoose.model('tasklist', tasklist);