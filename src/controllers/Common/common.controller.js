const { StatusCodes } = require("http-status-codes");
const auth = require("../../middlewares/auth");

const LOGOUT = async (req, res) => {
 //clear the cookies
 res.clearCookie()

 return res.status(StatusCodes.OK).send({
  message: 'Logout succesfull !!',
 })
}

const REGENERATE_TOKEN = async (req, res) => {
 const { uid } = req.body;

 //generate the token
 const { accessToken, refreshToken } = auth.GenerateJWT(uid);
 return res.status(StatusCodes.CREATED).send({
  message: 'Token regenerated succesfully !!',
  accessToken: accessToken,
  refreshToken: refreshToken
 });
}


module.exports = { LOGOUT, REGENERATE_TOKEN }