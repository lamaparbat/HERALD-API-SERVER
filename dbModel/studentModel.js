//importing mongoose
const mongoose = require("mongoose");

//define schema
const studentSchema = new mongoose.Schema({
 uid: String,
 createOn: String
});

module.exports = new mongoose.model("students", studentSchema);