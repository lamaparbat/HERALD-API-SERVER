const routineModel = require('../../../models/routineModel');
const { StatusCodes } = require("http-status-codes");

const GetRoutine = async (req, res) => {
    //fetch all routine from db
    const result = await routineModel.find();
  
    // if there are no routine in db
    if (result.length == 0) {
      return res.status(StatusCodes.NO_CONTENT).send({
        message: 'Result: 0 found !!',
      })
    }
  
    // destructuring query strings
    const fields = req.query;
    let length = Object.keys(fields).length;
  
    // if level or group is provided filter according to fields
    if (length != 0) {
      const filterData = result.filter(data =>
        (fields.level ? data.group.includes(`L${fields.level}`) : true) &&
        (fields.group ? data.group.includes(`CG${fields.group}`) : true)
      )
      return res.status(StatusCodes.OK).send({
        message: filterData
      })
    }
    // if both level and group is not provided show all routines
    else {
      return res.status(StatusCodes.OK).send({
        message: result,
      })
    }
  }

  module.exports = GetRoutine;