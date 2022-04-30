//importing mongoose
const mongoose = require("mongoose");

//define schema
const adminSchema = new mongoose.Schema({
 email: String,
 password:String,
 createdOn: String
});

module.exports = new mongoose.model("admins", adminSchema);