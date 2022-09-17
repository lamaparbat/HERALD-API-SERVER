const routineModel = require("../../../models/routineModel");
const notifModel = require("../../../models/notificationModel");
const { StatusCodes } = require("http-status-codes");
const pusher = require("../../../utils/Socket/SocketConnection");
const timeConvertor = require("../../../utils/timeConvertor");
const {
  CLASS_TYPE,
  WLV_BLOCK,
  HCK_BLOCK,
  ROUTINE_PAYLOAD,
} = require("../../../constants/index");

const PostRoutine = async (req, res) => {
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

  //check if all attributes are recieved or not ?
  let checkPayload = true;
  const payload = Object.keys(req.body);
  ROUTINE_PAYLOAD.forEach((element) => {
    if (!payload.includes(element)) checkPayload = false;
  });

  if (!checkPayload) {
    return res.status(StatusCodes.PARTIAL_CONTENT).send({
      success: false,
      message: "Some fields are missing. Please provide all the fields !!",
    });
  }

  // validate time format
  var regex = new RegExp(/^([0]?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)?$/i);
  if (!(regex.test(startTime) && regex.test(endTime))) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "Invalid time format! Please provide time in AM/PM format",
    });
  }
  // converting given payload to proper format
  let payLoadStartTime = startTime;
  let payLoadEndTime = endTime;
  payLoadEndTime = timeConvertor(payLoadEndTime);
  payLoadStartTime = timeConvertor(payLoadStartTime);

  // making payload upper case
  let modifiedBlockName = blockName.toUpperCase();
  let modifiedRoomName = roomName.toUpperCase();
  let modifiedDay = day.toUpperCase();
  let modifiedModuleName = moduleName.toUpperCase();
  let modifiedClassType = classType.toUpperCase();
  let modifiedGroup = [];
  if (Array.isArray(group))
    modifiedGroup = group.map((element) => element.toUpperCase());
  else modifiedGroup.push(group.toUpperCase());
  let modifiedTeacherName = teacherName.toUpperCase();

  // check if group array has duplicate groups

  const checkIfDuplicateExists = (arr) => new Set(arr).size !== arr.length;
  if (checkIfDuplicateExists(modifiedGroup))
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "Found duplicate group name!",
    });

  // validate classType
  if (
    modifiedClassType !== CLASS_TYPE.LECTURE &&
    modifiedClassType !== CLASS_TYPE.TUTORIAL &&
    modifiedClassType !== CLASS_TYPE.WORKSHOP
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "Invalid class type!",
    });
  }

  // validate roomName and blockName
  if (modifiedBlockName !== "HERALD" && modifiedBlockName !== "WOLVERHAMPTON") {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "Invalid Block Name!",
    });
  }
  if (
    (modifiedBlockName === "HERALD" && !HCK_BLOCK.includes(modifiedRoomName)) ||
    (modifiedBlockName === "WOLVERHAMPTON" &&
      !WLV_BLOCK.includes(modifiedRoomName))
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: "BlockName or room name is invalid!",
    });
  }
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
    if (test && type === "room") return "room";
    else if (test && type === "teacher") return "teacher";
    else if (test && type === "class") return "class";
    else return "none";
  };
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
  } catch (err) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
  }

  // case 3: one group cannot have diferent classes on same time range

  try {
    const classData = await routineModel.find({
      day: modifiedDay,
      group: { $in: modifiedGroup },
    });
    if (checkTime(classData, "class") === "class") {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "This group has another class in this time",
      });
    }
  } catch (err) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
  }

  // case 4: One group cannot have multiple class of same module in a single day

  try {
    const dayData = await routineModel.find({
      group: { $in: modifiedGroup },
      moduleName: modifiedModuleName,
    });
    let check = false;
    dayData.forEach((element) => {
      if (modifiedModuleName === element.moduleName) check = true;
    });
    if (check) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "The given group has already taken this class",
      });
    }
  } catch (err) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
  }

  const data = new routineModel({
    courseType: courseType.toUpperCase(),
    moduleName: moduleName.toUpperCase(),
    teacherName: modifiedTeacherName,
    classType: modifiedClassType,
    group: modifiedGroup,
    roomName: modifiedRoomName,
    blockName: modifiedBlockName,
    day: modifiedDay,
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

  data
    .save()
    .then(async () => {
      // init the scheduler tracker

      //upload message to notification db
      const notifData = new notifModel({
        message: `Dear ${modifiedGroup} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
        group: modifiedGroup,
        createdOn: new Date().toLocaleDateString(),
      });

      try {
        const result = await notifData.save();
        if (result.message) {
          pusher.trigger("my-channel", "notice", {
            message: `Dear ${modifiedGroup} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
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
};

module.exports = PostRoutine;
