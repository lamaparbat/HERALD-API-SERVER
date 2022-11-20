const router = require('express').Router();
const auth = require("../middlewares/auth");

const {
    GetStatus,
    GetRooms,
    GetClassType,
    GetCourseType
} = require("../controllers/index.controller").constantControllers;

router.get('/getStatus', auth.VerifyJWT(['admin', 'teacher', 'student']), GetStatus)
router.get('/getRooms', auth.VerifyJWT(['admin', 'teacher', 'student']), GetRooms)
router.get('/getClassType', auth.VerifyJWT(['admin', 'teacher', 'student']), GetClassType)
router.get('/getCourseType', auth.VerifyJWT(['admin', 'teacher', 'student']), GetCourseType)


module.exports = router;