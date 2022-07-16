const router = require('express').Router();
const auth = require("../middlewares/auth");
const {
 POST_FEEDBACK,
 GET_FEEDBACK
} = require("../controllers/index.controller").feedbackControllers;


router.post('/api/v4/feedback/postFeedback', auth.VerifyJWT, POST_FEEDBACK);

router.get('/api/v4/feedback/getFeedback', auth.VerifyJWT, GET_FEEDBACK);

router.delete('/api/v4/feedback/deleteFeedback', auth.VerifyJWT, feedbackUpload.single('file'), async (req, res) => {
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