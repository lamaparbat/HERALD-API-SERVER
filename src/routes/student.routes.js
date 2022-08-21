const router = require('express').Router();
const { LOGIN, GET_STUDENT_LIST } = require('../controllers/index.controller').studentControllers;

router.post('/student/Login', LOGIN);

router.get('/student/studentlist', GET_STUDENT_LIST);

module.exports = router;

