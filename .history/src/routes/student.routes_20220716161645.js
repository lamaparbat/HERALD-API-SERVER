const router = require('express').Router();
const { LOGIN } = require('../controllers/student.controllers').studentControllers;

router.post('/api/v4/student/Login', STUDENT_CONTROLLER.LOGIN )

module.exports = router;

