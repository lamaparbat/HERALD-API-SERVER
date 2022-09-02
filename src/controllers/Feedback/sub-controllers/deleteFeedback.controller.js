
const { StatusCodes } = require("http-status-codes");
const feedbackModel = require('../../../models/feedbackModel');
const fs = require('fs');
const pathSplitter = require('../../../utils/pathSplitter');

const DELETE_FEEDBACK = async (req, res) => {
    const { feedbackId } = req.query;
    //delete feedback post using id
    try {
        let filename = await feedbackMode.find({ _id: feedbackId });
        filename = filename[0].file;
        feedbackModel.deleteOne({ _id: feedbackId }, (err, doc) => {
            if (err) {
                return res.status(StatusCodes.NOT_ACCEPTABLE).send("Invalid feedback ID !!");
            } else {
                //deleting local file 
                try {
                    fs.unlinkSync(`${pathSplitter(__dirname, 'src')}${filename}`);
                } catch (err) {}
                return res.status(StatusCodes.CREATED).send("Routine deleted successfully !!");
            }
        });
    } catch (error) {
        let logs = `${error.name}: ${error.message}`;
        let statusCode = error.name === "TypeError" || "ReferenceError" ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).send(logs);
    }
}

module.exports = DELETE_FEEDBACK