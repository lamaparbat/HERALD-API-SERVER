//importing mongoose
const mongoose = require("mongoose");

//define schema
const studentSchema = new mongoose.Schema({
 uid: String,
 group:String,
 createdOn: String
});

module.exports = new mongoose.model("students", studentSchema);