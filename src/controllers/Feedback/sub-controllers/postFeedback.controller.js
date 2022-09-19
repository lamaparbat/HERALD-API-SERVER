const { StatusCodes } = require("http-status-codes");
const feedbackModel = require('../../../models/feedbackModel');

const POST_FEEDBACK = async (req, res) => {
 // destructuring the binded data
 const { reportType, description, uploadFileName, withProof } = req.body;

 try {
  if (reportType.length > 3 && description.length > 3 && uploadFileName !== null) {
   let data = new feedbackModel({
    reportType: reportType,
    description: description,
    date: new Date().toISOString()
   });

   // including evidence file if available
   if (withProof) {
    data = new feedbackModel({
     reportType: reportType,
     description: description,
     file: uploadFileName,
     date: new Date().toISOString(),
    });
   }

   //save the data
   data.save().then((data) => {
    res.status(StatusCodes.OK).send({
     message: data
    });
   }).catch(err => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
     message: "500 BACKEND SERVER ERROR !!"
    });
   });
  } else {
   res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
    message: "Validaton issues."
   });
  }
 } catch (error) {
  res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
   message: error.message
  });
 }
}

module.exports = POST_FEEDBACK
