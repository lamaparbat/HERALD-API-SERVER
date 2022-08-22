const { StatusCodes } = require("http-status-codes");
const lostFoundModel = require('../../../models/lostFoundModel');

const GetLostFoundData = async (req, res) => {
 //db mapping
 const data = await lostFoundModel.find();

 if (data.length != 0) {
  return res.status(StatusCodes.OK).send({
   items:data[0].items,
   desc:data[0].desc,
   lostDate: data[0].lostDate,
   isVictimRecievedData: data[0].isVictimRecievedData,
   createdAt: data[0].createdAt,
  });
 } else {
  return res.status(204).json({
   message: 'Result: 0 found !!',
  })
 }
}

module.exports = GetLostFoundData;
