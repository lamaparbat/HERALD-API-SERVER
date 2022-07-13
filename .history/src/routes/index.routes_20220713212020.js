const Router = require("express").Router();

// Import user define routes
const ROUTINE_ROUTES = require("./routine.routes1");


Router.use(ROUTINE_ROUTES);


module.exports = Router;