const router = require('express').Router();

const {
  LOGIN,
  SIGNUP } = require("../controllers/index.controller").teacherControllers;

// Teacher Login
router.post('/api/v4/teacher/Login',LOGIN);

//register new Teacher
router.post('/api/v4/teacher/Signup', SIGNUP );

module.exports = router;

