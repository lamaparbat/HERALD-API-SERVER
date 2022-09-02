//importing module
const mongoose = require("mongoose");

//define schema
const feedbackSchema = new mongoose.Schema({
 reportType: String,
 description: String,
 file: String,
 date: String
});

module.exports = new mongoose.model("feedback", feedbackSchema);