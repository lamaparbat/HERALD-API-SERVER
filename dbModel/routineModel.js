//importing mongoose
const mongoose = require("mongoose");

//define schema
const routineSchema = new mongoose.Schema({
 course_type:String,
 module_name: String,
 lecturer_name: String,
 class_type: String,
 group: String,
 room_name: String,
 block_name: String,
 day:String,
 start_time: String,
 end_time: String,
 createdOn:String
});

module.exports = new mongoose.model("routines", routineSchema);