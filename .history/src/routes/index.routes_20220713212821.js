const Router = require("express").Router();

// Import user define routes
const ROUTINE_ROUTES = require("./routine.routes.js");
const ADMIN_ROUTES = require("./admin.routes.js");
const STUDENT_ROUTES = require("./student.routes.js");

Router.use(ROUTINE_ROUTES);
Router.use(ADMIN_ROUTES);
Router.use(STUDENT_ROUTES);


module.exports = Router;