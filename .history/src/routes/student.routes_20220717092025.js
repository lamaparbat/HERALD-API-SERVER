const router = require('express').Router();
const auth = require("../middlewares/auth");
const { LOGIN, GET_STUDENT_LIST } = require('../controllers/index.controller').studentControllers;

router.post('/api/v4/student/Login', LOGIN);

router.get('/api/v4/student/studentlist',auth.VerifyJWT, GET_STUDENT_LIST);

module.exports = router;

