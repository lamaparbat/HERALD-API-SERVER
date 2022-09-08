const router = require('express').Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const {
 POST_FEEDBACK,
 GET_FEEDBACK,
 DELETE_FEEDBACK
} = require("../controllers/index.controller").feedbackControllers;

//upload image name
var uploadFileName = null;
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, "../../uploads/");
 },
 filename: (req, file, cb) => {
  uploadFileName = Date.now() + "-" + file.originalname;
  req.body.uploadFileName = uploadFileName;
  cb(null, uploadFileName);
 }
});

const feedbackUpload = multer({
 storage: storage,
 limits: { fileSize: 1000000 }
}).single("proof_file");

router.post('/feedback/postFeedback', feedbackUpload, POST_FEEDBACK);

router.get('/feedback/getFeedback', auth.VerifyJWT(["admin"]), GET_FEEDBACK);

router.delete('/feedback/deleteFeedback', auth.VerifyJWT(["admin"]), DELETE_FEEDBACK);


module.exports = router;