const controllers = {
 adminControllers: require("./Admin/index.controller"),
 studentControllers: require("./Student/index.controller"),
 routineControllers: require("./Routines/index.controller"),
 teacherControllers: require("./Teacher/index.controller"),
 feedbackControllers: require("./Feedback/index.controller"),
 notificationControllers: require("./Notification/notification.controller"),
 uploaderControllers: require("./uploader.controller"),
 constantControllers: require("./Constants/index.controller"),
 commonControllers: require("./Common/common.controller"),
}

module.exports = controllers;