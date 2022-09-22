const router = require('express').Router();
const extractUser = require('../middlewares/extractUser')
const { LOGIN, SIGNUP } = require('../controllers/index.controller').adminControllers;


// Admin Login
router.post('/admin/Login', extractUser, LOGIN);

//register new user
router.post('/admin/Signup', SIGNUP);


module.exports = router;