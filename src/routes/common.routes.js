const router = require('express').Router();
const auth = require("../middlewares/auth");

const {
 LOGOUT,
 REGENERATE_TOKEN
} = require("../controllers/index.controller").commonControllers;

//logout
router.post('/Logout', LOGOUT);


//request for regenerate access token
router.put("/RegenerateToken", auth.regenerateAccessToken, REGENERATE_TOKEN)



module.exports = router;