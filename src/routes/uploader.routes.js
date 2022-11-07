const router = require('express').Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const { UPLOAD_STUDENT_LIST, UPLOAD_TEACHER_LIST, UPLOAD_ADMIN_LIST, UPLOAD_SCHEDULE } = require("../controllers/index.controller").uploaderControllers;
const path = require('path');

const scheduleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../../uploads`)
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const prefix = date.toString().slice(0, 24).split(' ').join('-')
        cb(null, prefix + '-' + file.originalname)
    }
})

const uploadFilter = (req, file, cb) => {
    if (path.extname(file.originalname) !== '.xlsx') cb(null, false)
    cb(null, true)
}

const scheduleUpload = multer({ storage : scheduleStorage, fileFilter : uploadFilter }).fields([{ name : 'schedule', maxCount : 1}]);

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

const collegeUpload = multer({ storage: storage2 }).single('excelfile');

router.post('/uploadSchedule', auth.VerifyJWT(['admin']), scheduleUpload, UPLOAD_SCHEDULE);

router.post("/uploadStudentList", collegeUpload, auth.VerifyJWT(["admin"]), UPLOAD_STUDENT_LIST );


router.post("/uploadTeacherList", auth.VerifyJWT(["admin"]), UPLOAD_TEACHER_LIST);


router.post("/uploadAdminList", auth.VerifyJWT(["admin"]), UPLOAD_ADMIN_LIST);


module.exports = router;