const routineModel = require("../../../models/routineModel");
const { StatusCodes } = require("http-status-codes");
const { SCOPE } = require("../../../constants/index");
const reverseWord = require("../../../utils/reverseWord");

const GetRoutine = async (req, res) => {
  const field = req.query;
  let fieldLength = Object.keys(field).length;

  // provide all the routines on admin scope
  if ((req.scope !== reverseWord(SCOPE.STUDENT_SCOPE)) && fieldLength === 0) {
    const result = await routineModel.find();
    return res.status(StatusCodes.OK).send({
      data: result,
    });
  }
  
  // if there is no payload on studen scope 
  if (fieldLength === 0 && (req.scope === reverseWord(SCOPE.STUDENT_SCOPE)))
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: "Please provide group name!",
    });
  
  
  //validating the groupName expression
  let groupName = field.group;
  groupName = groupName.toUpperCase();
  const regEx = new RegExp(/(L[4-6][CB]G\d+)/)
  if (regEx.test(groupName)) {
    //fetch all routine from db and filter with groupName
    const result = await routineModel.find();
    const filteredData = result.filter((data) =>
      data.group.includes(groupName)
    );
    // if there is no routine for provided groupName
    if (filteredData.length === 0) {
      return res.status(StatusCodes.NO_CONTENT).send({
        message: "No result found for this group!",
      });
    }
    else {
      return res.status(StatusCodes.OK).send({
        data: filteredData,
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
