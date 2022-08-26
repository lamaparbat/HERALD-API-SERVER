const routineModel = require('../../../models/routineModel');
const { StatusCodes } = require("http-status-codes");

const DeleteRoutine = (req, res) => {
  //get the routine doc id
  const { routineID } = req.query;
  
  routineModel
    .deleteOne({ _id: routineID })
    .then((data) => {
      return res.status(StatusCodes.OK).send({
        message: 'Routine succesfully deleted !!',
      })
    })
    .catch((err) => {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Failed to delete routine !!',
      })
    })
}

module.exports = DeleteRoutine;