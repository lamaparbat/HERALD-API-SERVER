const Router = require("express").Router();

// Import user define routes
const ROUTINE_ROUTES = require("routine.routes.js");


Router.use(ROUTINE_ROUTES);


module.exports = Router;