const router = require('express').Router();
const bcrypt = require("bcryptjs");
const { LOGIN } = require("../controllers/index.controller").teacherControllers;

// Teacher Login
router.post('/api/v4/teacher/Login',);

//register new Teacher
router.post('/api/v4/teacher/Signup', async (req, res) => {
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
            return res.status(201).send('Teachers created succesfully !!')
          })
          .catch((err) => {
            return res.status(500).send('500. SERVER ERROR!!')
          })
      } else {
        return res.status(412).send('User already exists !!')
      }
    })
    .catch((err) => {
      return console.log('500 SERVER ERROR !!')
    })
});

module.exports = router;

