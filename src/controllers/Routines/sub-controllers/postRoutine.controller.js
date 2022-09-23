const routineModel = require("../../../models/routineModel");
const notifModel = require("../../../models/notificationModel");
const { StatusCodes } = require("http-status-codes");
const pusher = require("../../../utils/Socket/SocketConnection");

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
    status,
  } = req.body;

  // making payload upper case

  let modifiedGroup = [];
  if (Array.isArray(group))
    modifiedGroup = group.map((element) => element.toUpperCase());
  else modifiedGroup.push(group.toUpperCase());

  const data = new routineModel({
    courseType: courseType.toUpperCase(),
    moduleName: moduleName.toUpperCase(),
    teacherName: teacherName.toUpperCase(),
    classType: classType.toUpperCase(),
    group: modifiedGroup,
    roomName: roomName.toUpperCase(),
    blockName: blockName.toUpperCase(),
    day: day.toUpperCase(),
    startTime: startTime,
    endTime: endTime,
    status: status.toUpperCase(),
    createdOn: new Date().toLocaleDateString(),
  });

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
