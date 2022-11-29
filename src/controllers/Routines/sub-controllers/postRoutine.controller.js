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
    groups,
    roomName,
    blockName,
    day,
    startTime,
    endTime,
    status,
  } = req.body;

  const data = new routineModel({
    ...req.body,
    createdOn: new Date().toLocaleDateString(),
  });

  data
    .save()
    .then(async () => {
      // init the scheduler tracker
      //upload message to notification db

      const notifData = new notifModel({
        message: `Dear ${groups} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
        groups,
        createdOn: new Date().toLocaleDateString(),
      });

      try {
        const result = await notifData.save();
        if (result.message) {
          pusher.trigger("my-channel", "notice", {
            message: `Dear ${groups} of ${courseType}, a new routine of ${moduleName} has recently published. Please see it once.`,
          });
          return res.status(200).send({
            message: "Routine posted successfully !!",
          });
        }
      } catch (error) {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(error);
      }
    })
    .catch((err) => {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
    });
};

module.exports = PostRoutine;
