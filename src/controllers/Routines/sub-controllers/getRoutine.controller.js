const routineModel = require("../../../models/routineModel");
const { StatusCodes } = require("http-status-codes");

const GetRoutine = async (req, res) => {
  const field = req.query;
  
  
  if (req.scope.includes("nimda")) {
    const result = await routineModel.find();
    return res.status(StatusCodes.OK).send({
      data: result,
    });
  }
  
  
  let fieldLength = Object.keys(field).length;
  // if there is no payload
  if (fieldLength === 0)
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: "Please provide group name!",
    });
  //validating the groupName expression
  let groupName = field.group;
  groupName = groupName.toUpperCase();
  if (
    groupName.length >= 5 &&
    groupName[0] === "L" &&
    !isNaN(groupName[1]) &&
    (groupName[2] === "C" || groupName[2] === "B") &&
    groupName[3] === "G" &&
    !isNaN(groupName[4])
  ) {
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
