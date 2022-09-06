const bcrypt = require("bcryptjs");
const adminModel = require('../../../models/adminModel');
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middlewares/auth")

var adminAttemptCount = 0, blockEmail;

const LOGIN = (req, res) => {
  let { email, password } = req.body;

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(StatusCodes.UNAUTHORIZED).send("Client side validation issues. Please carefully send the right format of email and password !!")
  }

  // excess attempt check
  if (adminAttemptCount > 4 && blockEmail === email) {
    return res.status(StatusCodes.FORBIDDEN).send({
      message: 'You exceed the 5 login attempt. Please try again after 5 min !!',
    });
  }

  //database mapping
  adminModel.find({ email: email, password: password }).then((data) => {
    if (data.length > 0) {
      //compare encrypt password
      if (bcrypt.compare(data[0].password, password) === false) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Password didnt matched !!')
      }

      const { accessToken, refreshToken } = auth.GenerateJWT(scope = "admin",email);
      return res.status(200).send({
        message: 'Login succesfully.',
        email: email,
        scope: "admin",
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    } else {
      //increase the wrong email counter by 1
      adminAttemptCount++;
      //if email counter reach 5, then store the cache
      if (adminAttemptCount === 5) {
        blockEmail = email;
        setTimeout(() => {
          //reset the attemptCount after 5 minutes
          adminAttemptCount = 0;
          blockEmail = null;

          console.log(`${email} you can login. => ${adminAttemptCount}`);
        }, 300000);
      }
      return res.status(StatusCodes.UNAUTHORIZED).send('Wrong email or password !!');
    }
  })
}

module.exports = LOGIN;
