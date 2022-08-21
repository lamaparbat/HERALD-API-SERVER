const bcrypt = require("bcryptjs");
const adminModel = require('../../models/adminModel');
const { StatusCodes } = require("http-status-codes");
const auth = require("../../middlewares/auth")

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

      const { accessToken, refreshToken } = auth.GenerateJWT(email);
      return res.status(200).send({
        message: 'Login succesfully.',
        email: email,
        scope: "teacher",
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

const SIGNUP = async (req, res) => {
  const { email, password } = req.body;

  // encrypt the password
  password = await bcrypt.hash(password, salt = 10);

  //search if user already exists ?
  adminModel
    .find({ email: email })
    .then((data) => {
      if (data.length === 0) {
        //insert new admin data
        const data = new adminModel({
          email: email,
          password: password,
          createdOn: new Date().toDateString(),
        })

        //final upload to db
        data
          .save()
          .then(() => {
            return res.status(StatusCodes.CREATED).send('Admin created succesfully !!');
          })
          .catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('500. SERVER ERROR!!');
          })
      } else {
        return res.status(StatusCodes.CONFLICT).send('User already exists !!');
      }
    })
    .catch((err) => {
      console.log('500 SERVER ERROR !!');
    })
}

module.exports = { LOGIN, SIGNUP }