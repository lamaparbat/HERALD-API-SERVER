//importing module
const mongoose = require("mongoose");

//define schema
const lostFoundSchema = new mongoose.Schema({
 items: Array,
 desc: String,
 lostDate: String,
 isVictimRecievedData:Boolean,
 createdAt: String,
 updatedAt: String
});


module.exports = new mongoose.model("lostfound", lostFoundSchema);