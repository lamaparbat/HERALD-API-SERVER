const router = require('express').Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const { UPLOAD_STUDENT_LIST, UPLOAD_TEACHER_LIST, UPLOAD_ADMIN_LIST } = require("../controllers/index.controller").uploaderControllers;

//upload image name
var uploadFileName = null;


// upload college data
const storage2 = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, "collegeData");
 },
 filename: (req, file, cb) => {
  uploadFileName = Date.now() + "-" + file.originalname;
  cb(null, uploadFileName);
 }
});
const collegeUpload = multer({ storage: storage2 });


router.post("/api/v4/uploadStudentList", auth.VerifyJWT, collegeUpload.single("file"), UPLOAD_STUDENT_LIST );


router.post("api/v4/uploadTeacherList", auth.VerifyJWT, UPLOAD_TEACHER_LIST);


router.post("api/v4/uploadAdminList", auth.VerifyJWT, UPLOAD_ADMIN_LIST);


module.exports = router;