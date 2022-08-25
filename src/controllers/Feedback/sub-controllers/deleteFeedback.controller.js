
const { StatusCodes } = require("http-status-codes");
const feedbackModel = require('../../../models/feedbackModel');


const DELETE_FEEDBACK = async (req, res) => {
    const { feedbackid, filename } = req.headers;
   
    //delete feedback post using id
    try {
     feedbackModel.deleteOne({ _id: feedbackid }, (err, doc) => {
      if (err) {
       return res.status(StatusCodes.NOT_ACCEPTABLE).send("Invalid feedback ID !!");
      } else {
       //deleting local file 
       fs.unlinkSync(`uploads/${filename}`)
       return res.status(StatusCodes.CREATED).send("Routine deleted successfully !!");
      }
     });
    } catch (error) {
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('500 INTERNAL SERVER ERROR !!');
    }
   }

module.exports = DELETE_FEEDBACK