const router = require('express').Router();
const auth = require("../middlewares/auth");
const { LOGIN, GET_STUDENT_LIST } = require('../controllers/index.controller').studentControllers;

router.post('/student/Login', LOGIN);

router.get('/student/studentlist', auth.VerifyJWT(["admin"]), GET_STUDENT_LIST);

module.exports = router;

