
const studentModel = require('../../../models/studentModel');
const { StatusCodes } = require("http-status-codes");

const GET_STUDENT_LIST = async (req, res) => {
    try {
       const data = await studentModel.find();
 
       res.status(StatusCodes.OK).send(data)
    } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
 }

module.exports = GET_STUDENT_LIST