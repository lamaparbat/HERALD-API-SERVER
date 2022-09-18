const router = require('express').Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const { UPLOAD_STUDENT_LIST, UPLOAD_TEACHER_LIST, UPLOAD_ADMIN_LIST } = require("../controllers/index.controller").uploaderControllers;

// upload college data
const storage2 = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, `../../uploads`);
 },
 filename: (req, file, cb) => {
  req.body.uploadFileName = Date.now() + "-" + file.originalname;
  cb(null, req.body.uploadFileName);
 }
});
const collegeUpload = multer({ storage: storage2 });


router.post("/uploadStudentList", collegeUpload.single("excellfile"), auth.VerifyJWT(["admin"]), UPLOAD_STUDENT_LIST );


router.post("/uploadTeacherList", auth.VerifyJWT(["admin"]), UPLOAD_TEACHER_LIST);


router.post("/uploadAdminList", auth.VerifyJWT(["admin"]), UPLOAD_ADMIN_LIST);


module.exports = router;