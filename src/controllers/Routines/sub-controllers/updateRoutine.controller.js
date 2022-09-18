const routineModel = require('../../../models/routineModel');
const { StatusCodes } = require("http-status-codes");


const UpdateRoutine = (req, res) => {
  //get the routine doc id
  const {
    courseType,
    moduleName,
    teacherName,
    classType,
    group,
    roomName,
    blockName,
    day,
    startTime,
    endTime,
    status
  } = req.body;

  // checking if routineID is in req.body
  if (routineID === undefined)
    return res.status(StatusCodes.NOT_ACCEPTABLE).send({
      message: "routine ID is empty"
    });

  routineModel.findByIdAndUpdate(
    routineID,
    {
      courseType: courseType.toUpperCase(),
      moduleName: moduleName.toUpperCase(),
      teacherName: teacherName.toUpperCase(),
      classType: classType.toUpperCase(),
      group: group.toUpperCase(),
      roomName: roomName.toUpperCase(),
      blockName: blockName.toUpperCase(),
      day: day.toUpperCase(),
      startTime: startTime,
      endTime: endTime,
      status:status.toUpperCase(),
      createdOn: new Date().toLocaleDateString(),
    },
    (err, data) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error !!',
        })
      } else {
        console.log(data)
        return res.status(StatusCodes.CREATED).send({
          message: 'Routine succesfully updated !!',
        })
      }
    }
  )
}

module.exports = UpdateRoutine;