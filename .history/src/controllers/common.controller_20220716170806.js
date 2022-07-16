



const LOGOUT = async (req, res) => {
 //clear the cookies
 res.clearCookie()

 return res.status(200).send({
  message: 'Logout succesfull !!',
 })
}



module.exports = {LOGOUT}