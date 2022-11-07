const router = require('express').Router();
const auth = require("../middlewares/auth");
const { UPLOAD_STUDENT_LIST, UPLOAD_TEACHER_LIST, UPLOAD_ADMIN_LIST, UPLOAD_SCHEDULE } = require("../controllers/index.controller").uploaderControllers;

const { scheduleUpload, collegeUpload } = require('../configs/multerConfigs.config');

router.post('/uploadSchedule', auth.VerifyJWT(['admin']), scheduleUpload, UPLOAD_SCHEDULE);

router.post("/uploadStudentList", auth.VerifyJWT(["admin"]), collegeUpload, UPLOAD_STUDENT_LIST );


router.post("/uploadTeacherList", auth.VerifyJWT(["admin"]), UPLOAD_TEACHER_LIST);


router.post("/uploadAdminList", auth.VerifyJWT(["admin"]), UPLOAD_ADMIN_LIST);


module.exports = router;