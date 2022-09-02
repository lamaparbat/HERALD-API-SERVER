const teacherModel = require('../../../models/teacherModel');
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");


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
          const data = new teacherModel({
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
  
  module.exports = SIGNUP;