const { StatusCodes } = require("http-status-codes");

const DEFAULT_ROUTES = (req, res) => {
 return res.status(StatusCodes.OK).send('Server has started...')
}

module.exports = DEFAULT_ROUTES;