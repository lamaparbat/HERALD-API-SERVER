const { StatusCodes } = require("http-status-codes");
const feedbackModel = require('../../../models/feedbackModel');

const GET_FEEDBACK = async (req, res) => {
    //db mapping
    const data = await feedbackModel.find();
   
    if (data.length != 0) {
     return res.status(StatusCodes.OK).send({
      data: data,
     })
    } else {
     return res.status(StatusCodes.NO_CONTENT).send({
      message: 'Result: 0 found !!',
     })
    }
   }

module.exports = GET_FEEDBACK