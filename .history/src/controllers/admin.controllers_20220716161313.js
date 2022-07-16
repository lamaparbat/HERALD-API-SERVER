const bcrypt = require("bcryptjs");
const adminModel = require('../models/adminModel');


const LOGIN = (req, res) => {
 let { email, password } = req.body;

 //uid validation
 if (typeof email !== "string" || typeof password !== "string") {
  return res.status(400).send("Client side validation issues. Please carefully send the right format of email and password !!")
 }

 //email validation
 if (!(email.includes("gmail") && email.includes("@") && email.indexOf("@") < email.indexOf("gmail"))) {
  return res.status(404).send("Email validation error. please type correct email format !")
 }


 //database mapping
 adminModel.find({ email: email, password: password }).then((data) => {
  //compare encrypt password
  if (bcrypt.compare(data.password, password) === false) {
   return res.status(412).send('Password didnt matched !!')
  }

  if (data.length > 0) {
   return res.status(200).send({
    message: 'Login succesfully.',
    token: auth.GenerateJWT(email),
   })
  } else {
   return res.status(412).send('Wrong email or password !!')
  }
 })
}

module.exports = {LOGIN}