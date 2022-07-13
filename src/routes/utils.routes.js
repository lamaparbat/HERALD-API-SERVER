const router = require('express').Router();
const auth = require("../../src/middleware/auth");


//logout
router.post('/api/v4/Logout', async (req, res) => {
 //clear the cookies
 res.clearCookie()

 return res.status(200).send({
  message: 'Logout succesfull !!',
 })
})


//request for regenerate access token
router.put("/api/v4/RegenerateToken", auth.regenerateAccessToken, async (req, res) => {
 const { uid } = req.body;

 //generate the token
 const { access_token, refresh_token } = auth.GenerateJWT(uid);

 return res.status(200).send({
  message: 'Token regenerated succesfully !!',
  access_token: access_token,
  refresh_token: refresh_token
 });
})



module.exports = router;