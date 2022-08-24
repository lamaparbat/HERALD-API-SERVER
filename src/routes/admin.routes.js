const router = require('express').Router();
const { LOGIN, SIGNUP } = require('../controllers/index.controller').adminControllers;


// Admin Login
router.post('/admin/Login', LOGIN);

//register new user
router.post('/admin/Signup', SIGNUP);


module.exports = router;