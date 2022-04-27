//importing mongoose
const mongoose = require("mongoose");

//define schema
const teacherSchema = new mongoose.Schema({
 uid: String,
 createOn: String
});

module.exports = new mongoose.model("teachers", teacherSchema);