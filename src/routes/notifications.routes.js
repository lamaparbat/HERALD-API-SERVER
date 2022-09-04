const router = require('express').Router();
const auth = require("../middlewares/auth");
const { GET_NOTIFICATION } = require("../controllers/index.controller").notificationControllers;


router.get('/getNotifications', auth.VerifyJWT, GET_NOTIFICATION);


module.exports = router;