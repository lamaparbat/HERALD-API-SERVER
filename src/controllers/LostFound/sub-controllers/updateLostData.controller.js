const lostFoundModel = require('../../../models/lostFoundModel');
const { StatusCodes } = require("http-status-codes");

const UpdateLostData = async (req, res) => {
 const { _id } = req.body;
 
 try {
  const res = await lostFoundModel.findOneAndUpdate({ _id }, {
   isVictimRecievedData: true,
   updatedAt: new Date().toLocaleDateString()
  });
  res.status(StatusCodes.OK).send({
   message: "Report updated successfully !!"
  });
 } catch (error) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
   message: error.message
  });
 }
}

module.exports = UpdateLostData;