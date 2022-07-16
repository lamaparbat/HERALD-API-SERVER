const router = require('express').Router();
const auth = require("../../src/middleware/auth");
const notifModel = require("../../src/models/notificationModel");

router.post('/api/v4/getNotifications', auth.VerifyJWT, async (req, res) => {
 // destructure group
 const { group } = req.body;

 try {
  const result = await notifModel.find({ group: group })
  res.send(result);
 } catch (error) {
  res.status(404).send(error)
 }
})



module.exports = router;