//importing mongoose
const mongoose = require("mongoose");

//define schema
const notifSchema = new mongoose.Schema({
 message:String,
 createdOn: String
});

module.exports = new mongoose.model("notifications", notifSchema);