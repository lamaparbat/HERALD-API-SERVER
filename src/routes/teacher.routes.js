const router = require('express').Router();

const {
  LOGIN,
  SIGNUP } = require("../controllers/index.controller").teacherControllers;

// Teacher Login
router.post('/teacher/Login',LOGIN);

//register new Teacher
router.post('/teacher/Signup', SIGNUP );

module.exports = router;

