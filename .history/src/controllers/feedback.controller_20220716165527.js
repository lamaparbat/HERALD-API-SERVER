
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
    res.status(200).send({
     message: "Feedback posted successfully !!"
    });
   }).catch(err => {
    res.status(500).send({
     message: "500 BACKEND SERVER ERROR !!"
    });
   });
  } else {
   res.status(404).send({
    message: "Validaton issues."
   });
  }
 } else {
  res.status(404).send({
   message: "Some fields are missing."
  });
 }
}

const GET_FEEDBACK = async (req, res) => {
 //db mapping
 const data = await feedbackModel.find();

 if (data.length != 0) {
  return res.status(200).send({
   data: data,
  })
 } else {
  return res.status(404).send({
   message: 'Result: 0 found !!',
  })
 }
}

module.exports = { POST_FEEDBACK, GET_FEEDBACK }