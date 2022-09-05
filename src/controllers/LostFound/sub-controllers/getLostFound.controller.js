const { StatusCodes } = require("http-status-codes");
const lostFoundModel = require('../../../models/lostFoundModel');

const GetLostFoundData = async (req, res) => {
 //db mapping
 const data = await lostFoundModel.find();

 if (data.length != 0) {
  return res.status(StatusCodes.OK).send(data);
 } else {
  return res.status(204).json({
   message: 'Result: 0 found !!',
  })
 }
}

module.exports = GetLostFoundData;
