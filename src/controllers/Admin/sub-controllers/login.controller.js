const bcrypt = require("bcryptjs");
const adminModel = require('../../../models/adminModel');
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middlewares/auth")


const LOGIN = (req, res) => {
  let { email, password } = req.body;
  // user contains the object passed by the extractUser middleware
  let user = req.user;

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(StatusCodes.UNAUTHORIZED).send("Client side validation issues. Please carefully send the right format of email and password !!")
  }

  // excess attempt check
  if (user.attempts >= 5) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: 'You exceed the 5 login attempt. Please try again after 5 min !!',
    });
  }

  // database mapping
  adminModel.find({ email: email }).then(async ([data]) => {
    if (data) {
      // compare encrypt password
      if (!await bcrypt.compare(password, data.password)) {
        ++user.attempts
        // if the attempts counter reachers 5 we block that user from login
        if (user.attempts === 5) {
          setTimeout(() => {
            // reset the attemptCount after 5 minutes
            user.attempts = 0
            console.log(`${email} you can login. => ${adminAttemptCount}`);
          }, 300000);
        }
        return res.status(StatusCodes.UNAUTHORIZED).send('Password didnt matched !!')
      }
      user.attempts = 0

      const { accessToken, refreshToken } = auth.GenerateJWT(scope = "admin", email);
      return res.status(200).send({
        message: 'Login succesfully.',
        email: email,
        scope: "admin",
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    }
    // attempt counter is not calculated when user enters wrong email
    return res.status(StatusCodes.UNAUTHORIZED).send('Email didnt match please try again!');
  })
}

module.exports = LOGIN;
