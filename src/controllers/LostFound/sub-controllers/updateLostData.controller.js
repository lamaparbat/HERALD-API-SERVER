const lostFoundModel = require('../../../models/lostFoundModel');
const { StatusCodes } = require("http-status-codes");

const UpdateLostData = async (req, res) => {
 const { _id } = req.body;
 if(_id===undefined) return res.status(StatusCodes.BAD_REQUEST).send({
    message: "Please provide routine ID! "
 })   

 try {
  const result = await lostFoundModel.findOneAndUpdate({ _id }, {
   isVictimRecievedData: true,
   updatedAt: new Date().toLocaleDateString()
  });
  if(result === null){
    return res.status(StatusCodes.BAD_REQUEST).send({
        message: "Incorrect routine Id"
    })
  }
  return res.status(StatusCodes.OK).send({
   message: "Report updated successfully !!"
  });
 } catch (error) {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
   message: error.message
  });
 }
}

module.exports = UpdateLostData;