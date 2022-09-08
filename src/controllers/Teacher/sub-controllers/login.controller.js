const teacherModel = require('../../../models/teacherModel');
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middlewares/auth")

// flag
var teacherAttemptCount = 0, blockEmail;

const LOGIN = async (req, res) => {
  let { email, password } = req.body;

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Client side validation issues. Please carefully send the right format of email and password !!")
  }

  // excess attempt check
  if (teacherAttemptCount > 4 && blockEmail === email) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: 'You exceed the 5 login attempt. Please try again after 5 min !!',
    });
  }

  //database mapping
  teacherModel.find({ email: email}).then((data) => {
    if (data.length > 0) {
      //compare encrypt password
      if (bcrypt.compare(data[0].password, password) === false) {
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
    } else {
      //increase the wrong email counter by 1
      teacherAttemptCount++;
      //if email counter reach 5, then store the cache
      if (teacherAttemptCount === 5) {
        blockEmail = email;
        setTimeout(() => {
          //reset the attemptCount after 5 minutes
          teacherAttemptCount = 0;
          blockEmail = null;

          console.log(`${email} you can login. => ${teacherAttemptCount}`);
        }, 300000);
      }
      return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send('Wrong email or password !!')
    }
  });
}

module.exports = LOGIN
