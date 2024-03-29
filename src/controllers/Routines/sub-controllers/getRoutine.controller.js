const routineModel = require("../../../models/routineModel");
const { StatusCodes } = require("http-status-codes");
const { SCOPE } = require("../../../constants/index").COMMON_CONSTANT;

const GetRoutine = async (req, res) => {
  
  // getting routine by ID
  const {routineID} = req.params;
  if(routineID !== undefined && req.scope !== SCOPE.STUDENT_SCOPE) {
    try {
      const result= await routineModel.findById(routineID);
      return res.status(StatusCodes.OK).send({
        data: result 
      })
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Invalid routineID'
      })
    }
  }
  
  const field = req.query;
  let fieldLength = Object.keys(field).length;

  // provide all the routines on admin scope
  if (req.scope !== SCOPE.STUDENT_SCOPE && fieldLength === 0) {
    const result = await routineModel.find();
    return res.status(StatusCodes.OK).send({
      data: result,
    });
  }

  // if there is no payload on studen scope 
  if (fieldLength === 0 && req.scope === SCOPE.STUDENT_SCOPE)
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: "Please provide group name!",
    });


  //validating the groupName expression
  let groupName = field.group;
  groupName = groupName.toUpperCase();

  const pattern = new RegExp(/L[4-9][CB]G\d+/)

  if (pattern.test(groupName)) {
    //fetch all routine from db and filter with groupName
    const result = await routineModel.find({ groups: groupName });
    // if there is no routine for provided groupName
    if (!result.length) {
      return res.status(StatusCodes.NO_CONTENT).send({
        message: "No result found for this group!",
      });
    }
    else {
      return res.status(StatusCodes.OK).send({
        data: result,
      });
    }
  }
  // invalid groupName expression
  else {
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: "invalid group name!",
    });
  }
};

module.exports = GetRoutine;
