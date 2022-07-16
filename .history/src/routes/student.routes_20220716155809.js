const router = require('express').Router();
const STUDENT_CONTROLLER = require('../controllers/student.controllers');


//login routing
router.post('/api/v4/student/Login', STUDENT_CONTROLLER.Login )



module.exports = router;

