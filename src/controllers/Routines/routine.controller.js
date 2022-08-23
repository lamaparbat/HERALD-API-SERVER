const routineModel = require('../../models/routineModel');
const { StatusCodes } = require("http-status-codes");
const jobScheduler = require("../../utils/scheduler/index");

const POST_ROUTINE = async (req, res) => {
  //destructuring incoming data
  const {
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
  } = req.body

  

  //check if all attributes are recieved or not ?
  if (Object.keys(req.body).length < 9) {
    return res
      .status(StatusCodes.PARTIAL_CONTENT)
      .send('Some fields are missing. Please provide all the fields !!')
  }

  //minor validation
  if (
    courseType.length > 0 &&
    moduleName.length > 0 &&
    lecturerName.length > 0 &&
    classType.length > 0 &&
    group.length > 0 &&
    roomName.length > 0 &&
    day.length > 0 &&
    startTime.length > 0 &&
    endTime.length > 0 &&
    blockName.length > 0
  ) {
    const data = new routineModel({
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
      status: "Upcoming",
      createdOn: new Date().toLocaleDateString(),
    });

    const result = await routineModel.find({ createdOn: new Date().toLocaleDateString(), day: day, moduleName: moduleName });
    if (result.length > 0) {
      res.status(404).send(`Routine of ${moduleName} for the date ${new Date().toLocaleDateString()} has already been created.`)
    }

    data.save().then(async () => {
      // init the scheduler tracker
      
      //upload message to notification db
      const notifData = new notifModel({
        message: `Dear ${group} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
        group: group,
        createdOn: new Date().toLocaleDateString(),
      });

      try {
        const result = await notifData.save()
        if (result.message) {
          pusher.trigger("my-channel", "notice", {
            message: `Dear ${group} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`
          });
          return res.status(200).send({
            message: 'Routine posted successfully !!',
          })
        }
      } catch (error) {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err)
      }
    })
      .catch((err) => {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err)
      })
  } else {
    return res.status(StatusCodes.PARTIAL_CONTENT).send('Please fill all the field !!')
  }
}

const GET_ROUTINE = async (req, res) => {
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
    return res.status(StatusCodes.ACCEPTED).send({
      message: filterData
    })
  }
  // if both level and group is not provided show all routines
  else {
    return res.status(StatusCodes.ACCEPTED).send({
      message: result,
    })
  }
}

const UPDATE_ROUTINE = (req, res) => {
  //get the routine doc id
  const {
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

const DELETE_ROUTINE = (req, res) => {
  //get the routine doc id
  const { routineID } = req.query
  res.json(routineID)
  // routineModel
  //   .remove({ _id: routineID })
  //   .then((data) => {
  //     return res.status(StatusCodes.OK).send({
  //       message: 'Routine succesfully deleted !!',
  //     })
  //   })
  //   .catch((err) => {
  //     return res.status(StatusCodes.BAD_REQUEST).send({
  //       message: 'Failed to delete routine !!',
  //     })
  //   })
}

module.exports = {
  POST_ROUTINE,
  GET_ROUTINE,
  UPDATE_ROUTINE,
  DELETE_ROUTINE
}