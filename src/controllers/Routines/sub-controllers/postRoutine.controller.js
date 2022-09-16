const routineModel = require("../../../models/routineModel");
const notifModel = require("../../../models/notificationModel");
const CLASS_TYPE = require("../../../constants/index").CLASS_TYPE
const { StatusCodes } = require("http-status-codes");
const pusher = require("../../../utils/Socket/SocketConnection");

const PostRoutine = async (req, res, next) => {
  //destructuring incoming data
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
  } = req.body;
  console.log(group);

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
      if (startingTime[0] === "12")
        modifiedStartingTime = parseInt(startingTime[0] + startingTime[1]);
      else
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
      return "room";
    } else if (test && type === "teacher") {
      return "teacher";
    } else if (test && type === "class") {
      return "class";
    } else {
      return "none";
    }
  };

  // making payload upper case
  let modifiedBlockName = blockName.toUpperCase();
  let modifiedRoomName = roomName.toUpperCase();
  let modifiedDay = day.toUpperCase();
  let modifiedModuleName = moduleName.toUpperCase();
  let modifiedClassType = classType.toUpperCase();
  let modifiedGroup=[]
  if(Array.isArray(group))modifiedGroup = group.map((element) => element.toUpperCase());
  else modifiedGroup.push(group.toUpperCase())
  console.log(modifiedGroup)
  
  let modifiedTeacherName = teacherName.toUpperCase();
  console.log(CLASS_TYPE.LECTURE)
  console.log(modifiedClassType)
  // validate classType
  if(modifiedClassType !== CLASS_TYPE.LECTURE &&
    modifiedClassType !== CLASS_TYPE.TUTORIAL &&
    modifiedClassType !== CLASS_TYPE.WORKSHOP){
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "Invalid class type!"
      })
    }

  //logical validation
  // case 1 : check if classroom is blocked or not

  const check = await routineModel.find({
    blockName: modifiedBlockName,
    roomName: modifiedRoomName,
    day: modifiedDay,
  });
  // if end time is less than start time
  if (payLoadEndTime <= payLoadStartTime) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "end time should be greater than start time",
    });
  }
  if (checkTime(check, "room") === "room") {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message:
        "The room for this particular time is already reserved for another class",
    });
  }

  // case 2 : check if teacher is already assigned in another class at give time

  try {
    const teacherData = await routineModel.find({
      teacherName: modifiedTeacherName,
      day: modifiedDay,
    });
    if (checkTime(teacherData, "teacher") === "teacher") {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message:
          "The teacher is already reserved for another class in this time",
      });
    }
  } catch (error) {
    console.log(error.message);
  }

  // case 3: one group cannot have diferent classes on same time range

  try {
    const classData = await routineModel.find({
      day: modifiedDay,
      group: { $in: modifiedGroup },
    });
    console.log("classData " + classData);
    if (checkTime(classData, "class") === "class") {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "This group has another class in this time",
      });
    }
  } catch (error) {
    console.log(error.message);
  }

  // case 4: One group cannot have multiple class of same module in a single day

  try {
    const dayData = await routineModel.find({
      group: {$in: modifiedGroup},
      moduleName: modifiedModuleName,
    });
    console.log("dayData: "+dayData)
    let check = false;
    dayData.forEach(element => {
      if(modifiedModuleName === element.moduleName) check = true;
    });
    if(check){
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "The given group has already taken this class"
      })
    }
  } catch (error) {
    console.log(error.message);
  }

  //minor validation
  if (
    courseType.length > 0 &&
    moduleName.length > 0 &&
    teacherName.length > 0 &&
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
      teacherName: modifiedTeacherName,
      classType: classType.toUpperCase(),
      group: modifiedGroup,
      roomName: roomName.toUpperCase(),
      blockName: blockName.toUpperCase(),
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
      return res
        .status(404)
        .send(
          `Routine of ${moduleName} for the date ${new Date().toLocaleDateString()} has already been created.`
        );
    }
    try {
      await data.save();
      return res.status(StatusCodes.OK).send({
              message: "Routine posted successfully !!",
            });
    } catch (error) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
    }

    // data.save()
    // .then(async () => {
    // init the scheduler tracker

    // //upload message to notification db
    // const notifData = new notifModel({
    //   message: `Dear ${group} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
    //   group: group,
    //   createdOn: new Date().toLocaleDateString(),
    // });

    // try {
    //   const result = await notifData.save();
    //   if (result.message) {
    //     pusher.trigger("my-channel", "notice", {
    //       message: `Dear ${group} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
    //     });
    //     return res.status(200).send({
    //       message: "Routine posted successfully !!",
    //     });
    //   }
    // } catch (error) {
    //   return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
    // }
    // })
    // .catch((err) => {
    //   console.log("hello");
    //   return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
    // });
  } else {
    return res
      .status(StatusCodes.PARTIAL_CONTENT)
      .send("Please fill all the field !!");
  }
};

module.exports = PostRoutine;
