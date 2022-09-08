const { StatusCodes } = require("http-status-codes");
const feedbackModel = require('../../../models/feedbackModel');

const POST_FEEDBACK = async (req, res) => {
 // destructuring the binded data
 const { reportType, description, uploadFileName } = req.body;
 
 // validation
 if (Object.keys(req.body).length < 2) {
  if (reportType.length > 3 && description.length > 3 && uploadFileName !== null) {
   //db insertion
   const data = new feedbackModel({
    reportType: reportType,
    description: description,
    file: uploadFileName,
    date: new Date().toISOString()
   });

   //save the data
   data.save().then(() => {
    res.status(StatusCodes.OK).send({
     message: "Feedback posted successfully !!"
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
 } else {
  res.status(StatusCodes.NOT_FOUND).send({
   message: "Some fields are missing."
  });
 }
}

module.exports = POST_FEEDBACK