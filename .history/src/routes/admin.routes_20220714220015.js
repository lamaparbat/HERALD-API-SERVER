const router = require('express').Router();
const bcrypt = require("bcryptjs");
const adminModel = require('../../src/dbModel/adminModel');


// Admin Login
router.post('/api/v4/admin/Login', (req, res) => {
  let { email, password } = req.body

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
})

//register new user
router.post('/api/v4/admin/Signup', async(req, res) => {
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
            return res.status(201).send('Admin created succesfully !!');
          })
          .catch((err) => {
            return res.status(500).send('500. SERVER ERROR!!');
          })
      } else {
        return res.status(412).send('User already exists !!');
      }
    })
    .catch((err) => {
      console.log('500 SERVER ERROR !!');
    })
})


module.exports = router;