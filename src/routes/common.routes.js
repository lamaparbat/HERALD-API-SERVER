const router = require('express').Router();
const auth = require("../middlewares/auth");
const {
 LOGOUT,
 REGENERATE_TOKEN
} = require("../controllers/index.controller").commonControllers;

//logout
router.post('/api/v4/Logout', LOGOUT);


//request for regenerate access token
router.put("/api/v4/RegenerateToken", auth.regenerateAccessToken, REGENERATE_TOKEN)



module.exports = router;