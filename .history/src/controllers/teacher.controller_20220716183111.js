const teacherModel = require('../models/teacherModel');
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const LOGIN = async (req, res) => {
 let { email, password } = req.body

 //uid validation
 if (typeof email !== "string" || typeof password !== "string") {
   return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Client side validation issues. Please carefully send the right format of email and password !!")
 }

 //email validation
 if (!(email.includes("gmail") && email.includes("@") && email.indexOf("@") < email.indexOf("gmail"))) {
   return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Email validation error. please type correct email format !")
 }

 if (teacherAttemptCount <= 5) {
  //database mapping
  teacherModel.find({ email: email }).then((data) => {
   //compare encrypt password
   if (bcrypt.compare(data.password, password) === false) {
     return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send('Password didnt matched !!')
   }

   if (data.length > 0) {
    return res.status(200).send({
     message: 'Login succesfully.',
     token: auth.GenerateJWT(email),
    })
   } else {
    teacherAttemptCount++;
     return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send('Wrong email or password !!')
   }
  })
 } else {
  return res.status(StatusCodes.FORBIDDEN).send({
   message:
    'You exceed the 5 login attempt. Please wait for 5 min to retry again !!',
  })
 }
}

const SIGNUP = async (req, res) => {
 // destructure data
 let { email, password } = req.body;

 // encrypt the password
 password = await bcrypt.hash(password, salt = 10);

 //search if user already exists ?
 teacherModel
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
      return res.status(StatusCodes.CREATED).send('Teachers created succesfully !!')
     })
     .catch((err) => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('500. SERVER ERROR!!')
     })
   } else {
    return res.status(StatusCodes.CONFLICT).send('User already exists !!')
   }
  })
  .catch((err) => {
   return console.log('500 SERVER ERROR !!')
  })
}



module.exports = { LOGIN, SIGNUP }