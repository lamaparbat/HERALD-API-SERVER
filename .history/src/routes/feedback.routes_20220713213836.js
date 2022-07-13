const router = require('express').Router();
const auth = require("../../src/middleware/auth");
const multer = require("multer");

//upload image name
var uploadFileName = null;


// upload college data
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, "collegeData");
 },
 filename: (req, file, cb) => {
  uploadFileName = Date.now() + "-" + file.originalname;
  cb(null, uploadFileName);
 }
});
const collegeUpload = multer({ storage: storage });


router.post('/api/v4/feedback/postFeedback', auth.VerifyJWT, collegeUpload.single('file'), async (req, res) => {
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
});

router.get('/api/v4/feedback/getFeedback', auth.VerifyJWT, collegeUpload.single('file'), async (req, res) => {
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
});

router.delete('/api/v4/feedback/deleteFeedback', auth.VerifyJWT, collegeUpload.single('file'), async (req, res) => {
 const { feedbackid, filename } = req.headers;

 //delete feedback post using id
 try {
  feedbackModel.deleteOne({ _id: feedbackid }, (err, doc) => {
   if (err) {
    return res.status(500).send("Invalid feedback ID !!");
   } else {
    //deleting local file 
    fs.unlinkSync(`uploads/${filename}`)
    return res.status(200).send("Routine deleted successfully !!");
   }
  });
 } catch (error) {
  return res.status(200).send('500 INTERNAL SERVER ERROR !!');
 }
});


module.exports = router;