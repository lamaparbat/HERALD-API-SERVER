//importing module
const mongoose = require("mongoose");

//define schema
const lostFoundSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    itemCategory: [{
        type: String,
        required: true
    }],
    description: String,
    lostDate: String,
    block: String,
    additionalDescription: String,
    isVictimRecievedData: Boolean,
    createdAt: String,
    updatedAt: String
});


module.exports = new mongoose.model("lostfound", lostFoundSchema);