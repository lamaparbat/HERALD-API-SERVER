const { StatusCodes } = require("http-status-codes");

const POST_FEEDBACK = async (req, res) => {
 // destructuring the binded data
 const { report_type, description } = req.body;

 // validation
 if (Object.keys(req.body).length < 7) {
  if (report_type.length > 3 && description.length > 3 && uploadFileName !== null) {
   //db insertion
   const data = new feedbackModel({
    report_type: report_type,
    description: description,
    file: uploadFileName
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

const GET_FEEDBACK = async (req, res) => {
 //db mapping
 const data = await feedbackModel.find();

 if (data.length != 0) {
  return res.status(StatusCodes.OK).send({
   data: data,
  })
 } else {
  return res.status(StatusCodes.NOT_FOUND).send({
   message: 'Result: 0 found !!',
  })
 }
}

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
    return res.status(200).send("Routine deleted successfully !!");
   }
  });
 } catch (error) {
  return res.status(200).send('500 INTERNAL SERVER ERROR !!');
 }
}

module.exports = { POST_FEEDBACK, GET_FEEDBACK, DELETE_FEEDBACK }