const teacherModel = require('../../../models/teacherModel');
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middlewares/auth")


const LOGIN = async (req, res) => {
  let { email, password } = req.body;
  // user contains object sent from extractUser middleware
  let user = req.user

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Client side validation issues. Please carefully send the right format of email and password !!")
  }

  // excess attempt check
  if (user.attempts >= 5) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: 'You exceed the 5 login attempt. Please try again after 5 min !!',
    });
  }

  //database mapping
  teacherModel.find({ email: email }).then(async ([data]) => {
    if (data) {
      //compare encrypt password
      if (!await bcrypt.compare(password, data.password)) {
        ++user.attempts
        if (user.attempts === 5) {
          setTimeout(() => {
            //reset the attemptCount after 5 minutes
            user.attempts = 0
            console.log(`${email} you can login. => ${adminAttemptCount}`);
          }, 300000);
        }
        return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send('Password didnt matched !!')
      }

      const { accessToken, refreshToken } = auth.GenerateJWT(scope = "teacher", email);
      return res.status(200).send({
        message: 'Login succesfully.',
        email: email,
        scope: "teacher",
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    }
    return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send('Wrong email or password !!')
  });
}

module.exports = LOGIN
