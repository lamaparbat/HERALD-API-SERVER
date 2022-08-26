const routineModel = require('../../../models/routineModel');
const { StatusCodes } = require("http-status-codes");


const UpdateRoutine = (req, res) => {
  //get the routine doc id
  const {
    routineID,
    courseType,
    moduleName,
    lecturerName,
    classType,
    group,
    roomName,
    blockName,
    day,
    startTime,
    endTime,
  } = req.body;

  routineModel.findByIdAndUpdate(
    routineID,
    {
      courseType: courseType.toUpperCase(),
      moduleName: moduleName.toUpperCase(),
      lecturerName: lecturerName,
      classType: classType.toUpperCase(),
      group: group.toUpperCase(),
      roomName: roomName.toUpperCase(),
      blockName: blockName,
      day: day.toUpperCase(),
      startTime: startTime,
      endTime: endTime,
      createdOn: new Date().toLocaleDateString(),
    },
    (err, data) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error !!',
        })
      } else {
        return res.status(StatusCodes.CREATED).send({
          message: 'Routine succesfully updated !!',
        })
      }
    }
  )
}

module.exports = UpdateRoutine;