const { StatusCodes } = require("http-status-codes");
const jobScheduler = require("../utils/scheduler/index");

const DEFAULT_ROUTES = (req, res) => {
 return res.status(StatusCodes.OK).send('Server has started...')
}

module.exports = DEFAULT_ROUTES;