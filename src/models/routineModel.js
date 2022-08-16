//importing mongoose
const mongoose = require("mongoose");

//define schema
const routineSchema = new mongoose.Schema({
 courseType:String,
 moduleName: String,
 lecturerName: String,
 classType: String,
 group: String,
 roomName: String,
 blockName: String,
 day:String,
 startTime: String,
 endTime: String,
 status: String,
 createdOn:String
});

module.exports = new mongoose.model("routines", routineSchema);