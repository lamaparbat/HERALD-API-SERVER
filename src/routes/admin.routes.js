const router = require('express').Router();
const { LOGIN, SIGNUP } = require('../controllers/Admin/admin.controller');


// Admin Login
router.post('/api/v4/admin/Login', LOGIN);

//register new user
router.post('/api/v4/admin/Signup', SIGNUP);


module.exports = router;