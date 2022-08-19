const controllers = {
 adminControllers: require("./Admin/admin.controller"),
 studentControllers: require("./Student/student.controller"),
 routineControllers: require("./Routines/routine.controller"),
 teacherControllers: require("./Teacher/teacher.controller"),
 feedbackControllers: require("./Feedback/feedback.controller"),
 notificationControllers: require("./Notification/notification.controller"),
 uploaderControllers: require("./uploader.controller"),
 commonControllers: require("./Common/common.controller"),
}

module.exports = controllers;