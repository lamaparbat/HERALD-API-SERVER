const router = require('express').Router();
const controllers = require('../controllers/index.controller');


// Admin Login
router.post('/api/v4/admin/Login', controllers.adminControllers.LOGIN);

//register new user
router.post('/api/v4/admin/Signup', async (req, res) => {
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