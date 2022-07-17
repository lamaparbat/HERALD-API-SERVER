const { StatusCodes } = require("http-status-codes");

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
 const { access_token, refresh_token } = auth.GenerateJWT(uid);
 return res.status(StatusCodes.CREATED).send({
  message: 'Token regenerated succesfully !!',
  access_token: access_token,
  refresh_token: refresh_token
 });
}


module.exports = { LOGOUT, REGENERATE_TOKEN }