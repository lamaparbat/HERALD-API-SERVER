const notifModel = require("../models/notificationModel");


const GET_NOTIFICATION = async (req, res) => {
 // destructure group
 const { group } = req.body;

 try {
  const result = await notifModel.find({ group: group })
  res.send(result);
 } catch (error) {
  res.status(404).send(error)
 }
}


module.exports = { GET_NOTIFICATION}