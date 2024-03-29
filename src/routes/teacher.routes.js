const router = require('express').Router();
const extractUser = require('../middlewares/extractUser')

const {
  LOGIN,
  SIGNUP } = require("../controllers/index.controller").teacherControllers;

// Teacher Login
router.post('/teacher/Login', extractUser, LOGIN);

//register new Teacher
router.post('/teacher/Signup', SIGNUP );

module.exports = router;

