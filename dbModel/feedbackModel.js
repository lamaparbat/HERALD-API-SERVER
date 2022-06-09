//importing module
const mongoose = require("mongoose");

//define schema
const feedbackSchema = new mongoose.Schema({
 report_type: String,
 description: String,
 file: Object,
 date: String
});

module.exports = new mongoose.model("feedback", feedbackSchema);