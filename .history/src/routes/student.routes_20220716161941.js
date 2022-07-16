const router = require('express').Router();
const { LOGIN } = require('../controllers/index.controllers').studentControllers;

router.post('/api/v4/student/Login', LOGIN )

module.exports = router;

