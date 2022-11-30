//importing mongoose
const mongoose = require("mongoose");

//define schema
const routineSchema = new mongoose.Schema({
    courseType: String,
    moduleName: String,
    teacherName: String,
    classType: String,
    groups: [{
        type: String,
        required: true
    }],
    roomName: String,
    blockName: String,
    day: String,
    startTime: String,
    endTime: String,
    status: String,
    createdOn: String
});

module.exports = new mongoose.model("routines", routineSchema);