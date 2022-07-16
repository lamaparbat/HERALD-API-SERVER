const router = require('express').Router();
const STUDENT_CONTROLLER = require('../controllers/student.controllers');

router.post('/api/v4/student/Login', STUDENT_CONTROLLER.LOGIN )

module.exports = router;

