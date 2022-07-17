const { StatusCodes } = require("http-status-codes");

setTimeout(() => {
 jobScheduler("* * * * * *", "default");
}, 500);
const DEFAULT_ROUTES = (req, res) => {
 return res.status(StatusCodes.OK).send('Server has started...')
}

module.exports = DEFAULT_ROUTES;