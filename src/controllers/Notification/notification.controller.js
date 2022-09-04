const notifModel = require("../../models/notificationModel");
const { StatusCodes } = require("http-status-codes");


const GET_NOTIFICATION = async (req, res) => {
 // destructure group
 const { group } = req.query;

 try {
  const result = await notifModel.find({ group: group.toUpperCase() })
  res.status(StatusCodes.OK).send(result);
 } catch (error) {
  res.status(StatusCodes.NOT_FOUND).send(error)
 }
}


module.exports = { GET_NOTIFICATION}