//importing mongoose
const mongoose = require("mongoose");

//define schema
const adminSchema = new mongoose.Schema({
 uid: String,
 createOn: String
});

module.exports = new mongoose.model("admins", adminSchema);