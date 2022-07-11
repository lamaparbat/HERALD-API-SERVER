//importing mongoose
const mongoose = require("mongoose");

//define schema
const teacherSchema = new mongoose.Schema({
 email: String,
 password:String,
 createdOn: String
});

module.exports = new mongoose.model("teachers", teacherSchema);