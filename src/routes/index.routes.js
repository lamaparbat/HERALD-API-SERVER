const Router = require("express").Router();

// Import user define routes
const ROUTINE_ROUTES = require("./routine.routes.js");
const ADMIN_ROUTES = require("./admin.routes.js");
const STUDENT_ROUTES = require("./student.routes.js");
const TEACHER_ROUTES = require("./teacher.routes.js");
const UPLOADER_ROUTES = require("./uploader.routes.js");
const FEEDBACK_ROUTES = require("./feedback.routes.js");
const UTILS_ROUTES = require("./common.routes.js");
const DEFAULT_ROUTES = require("./default.routes");
const LOSTFOUND_ROUTES = require("./lostfound.routes");

const MAIL_ROUTES = Router.get('mailevents', async (req, res) => {
  consoe.log(req, res);
  res.send('success');
});

Router.use(ROUTINE_ROUTES);
Router.use(ADMIN_ROUTES);
Router.use(STUDENT_ROUTES);
Router.use(TEACHER_ROUTES);
Router.use(UPLOADER_ROUTES);
Router.use(FEEDBACK_ROUTES);
Router.use(UTILS_ROUTES);
Router.use(LOSTFOUND_ROUTES);
Router.use(DEFAULT_ROUTES);
Router.use(MAIL_ROUTES);

module.exports = Router;
