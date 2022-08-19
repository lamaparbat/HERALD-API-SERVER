const { StatusCodes } = require("http-status-codes");
const jobScheduler = require("../utils/scheduler/index");

const DEFAULT_ROUTES = (req, res) => {
 let welcomePageTemplatePath = __dirname.slice(0, __dirname.indexOf('src') + 3).concat('/public');
 return res.status(StatusCodes.OK).sendFile(welcomePageTemplatePath)
}

module.exports = DEFAULT_ROUTES;