const routineModel = require("../../../models/routineModel");
const notifModel = require("../../../models/notificationModel");
const { StatusCodes } = require("http-status-codes");
const pusher = require("../../../utils/Socket/SocketConnection");

const PostRoutine = async (req, res, next) => {
  //destructuring incoming data
  let {
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

  //check if all attributes are recieved or not ?
  if (Object.keys(req.body).length < 9) {
    return res
      .status(StatusCodes.PARTIAL_CONTENT)
      .send("Some fields are missing. Please provide all the fields !!");
  }

  // converting 10:00AM or 1:00PM type format to 24 hours

  const timeConvertor = (time) => {
    let startingTime = time.slice(0, -2);
    let modifiedStartingTime = 0;
    // for AM format
    if (
      time.charAt(time.length - 2) === "A" ||
      time.charAt(time.length - 2) === "a"
    ) {
      startingTime = time.split(":");
      modifiedStartingTime = parseInt(startingTime[0] + startingTime[1]);
    }
    // for PM format
    else {
      startingTime = time.split(":");
      modifiedStartingTime = parseInt(
        parseInt(startingTime[0]) + 12 + startingTime[1]
      );
    }
    return modifiedStartingTime;
  };

  // converting given payload to proper format

  let payLoadStartTime = startTime;
  let payLoadEndTime = endTime;
  payLoadEndTime = timeConvertor(payLoadEndTime);
  payLoadStartTime = timeConvertor(payLoadStartTime);

  const checkTime = (array, type) => {
    let test = false;
    array.forEach((element) => {
      let startingTime = element.startTime;
      let endingTime = element.endTime;
      startingTime = timeConvertor(startingTime);
      endingTime = timeConvertor(endingTime);
      if (
        (payLoadStartTime < endingTime && payLoadStartTime >= startingTime) ||
        (payLoadEndTime <= endingTime && payLoadEndTime > startingTime) ||
        (payLoadStartTime <= startingTime && payLoadEndTime >= endingTime)
      ) {
        test = true;
      }
    });
    if (test && type === "room") {
      return true;
    } else if (test && type === "teacher") {
      return true;
    } else if (test && type === "class") {
      return true;
    } else {
      return false;
    }
  };

  //logical validation
  // case 1 : check if classroom is blocked or not

  const check = await routineModel.find({
    blockName: blockName.toUpperCase(),
    roomName: roomName.toUpperCase(),
    day: day.toUpperCase(),
  });
  console.log(check)
  // if end time is less than start time
  if (payLoadEndTime <= payLoadStartTime) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "end time should be greater than start time",
    });
  }
  if (checkTime(check, "room")) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message:
        "The room for this particular time is already reserved for another class",
    });
  }

  // case 2 : check if teacher is already assigned in another class at give time

  try {
    const teacherData = await routineModel.find({
      lecturerName: lecturerName.toUpperCase(),
      day: day.toUpperCase(),
    });
    if (checkTime(teacherData, "teacher")) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: 
          "The teacher already reserved for another class in this time",
      });
    }
  } catch (error) {
    console.log(error.message);
  }

  // case 3: one group cannot have diferent classes on same time range

  try {
    const classData = await routineModel.find({
      day: day.toUpperCase(),
      group: group.toUpperCase(),
    });
    if (checkTime(classData, "class")) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message:
          "This group has another class in this time",
      });
    }
  } catch (error) {
    console.log(error.message);
  }

  // case 4: In one room, multiple groups can study at same time

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

    const result = await routineModel.find({
      createdOn: new Date().toLocaleDateString(),
      day: day,
      moduleName: moduleName,
    });
    if (result.length > 0) {
      res
        .status(404)
        .send(
          `Routine of ${moduleName} for the date ${new Date().toLocaleDateString()} has already been created.`
        );
    }

    data
      .save()
      .then(async () => {
        // init the scheduler tracker

        //upload message to notification db
        const notifData = new notifModel({
          message: `Dear ${group} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
          group: group,
          createdOn: new Date().toLocaleDateString(),
        });

        try {
          const result = await notifData.save();
          if (result.message) {
            pusher.trigger("my-channel", "notice", {
              message: `Dear ${group} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
            });
            return res.status(200).send({
              message: "Routine posted successfully !!",
            });
          }
        } catch (error) {
          return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }
      })
      .catch((err) => {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
      });
  } else {
    return res
      .status(StatusCodes.PARTIAL_CONTENT)
      .send("Please fill all the field !!");
  }
};

module.exports = PostRoutine;
