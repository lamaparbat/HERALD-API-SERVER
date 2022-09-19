const router = require('express').Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const {
 POST_FEEDBACK,
 GET_FEEDBACK,
 DELETE_FEEDBACK
} = require("../controllers/index.controller").feedbackControllers;

// upload feedback data
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, '../../uploads');
 },
 filename: (req, file, cb) => {
  req.body.uploadFileName = Date.now() + "-" + file.originalname;
  cb(null, req.body.uploadFileName);
 }
});
const feedbackUpload = multer({ storage: storage });

router.post('/feedback/postFeedback', feedbackUpload.single('proofFile'), auth.feedbackAuth(), auth.VerifyJWT(["admin"]), POST_FEEDBACK);

router.get('/feedback/getFeedback', auth.VerifyJWT(["admin"]), GET_FEEDBACK);

router.delete('/feedback/deleteFeedback', auth.VerifyJWT(["admin"]), DELETE_FEEDBACK);


module.exports = router;