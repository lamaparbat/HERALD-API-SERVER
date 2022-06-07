//importing module
const mongoose = require("mongoose");

//define schema
const feedbackSchema = new mongoose().Schema({
 email: String,
 message:String,
 date:String
})

module.exports = {}