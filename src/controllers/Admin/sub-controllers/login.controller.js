const bcrypt = require("bcryptjs");
const adminModel = require('../../../models/adminModel');
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middlewares/auth")
const redisClient = require('../../../utils/Database/REDIS_client')

var adminAttemptCount = 0, blockEmail;

const LOGIN = async (req, res) => {
  let admin, passwordCheck;
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

  //database mapping, getting data from redis
  const adminFromRedis = await redisClient.hGet('admin', email)
  admin = adminFromRedis ? JSON.parse(adminFromRedis) : null
  passwordCheck = admin ? await bcrypt.compare(password, admin.password) : null
  if (adminFromRedis && passwordCheck) {
    const { accessToken, refreshToken } = auth.GenerateJWT(scope = "admin", email)
    adminAttemptCount = 0
    return res.send({
      message: 'Login succesfully.',
      email: email,
      scope: "admin",
      accessToken,
      refreshToken
    })
  }

  //database mapping
  admin = await adminModel.findOne({ email })
  passwordCheck = admin ? await bcrypt.compare(password, admin.password) : null
  if (admin && passwordCheck) {
    const { accessToken, refreshToken } = auth.GenerateJWT(scope = "admin", email)
    //saving to redis if data has expired already or if found in MongoDB but not in redis
    await redisClient.hSet('admin', email, JSON.stringify(admin))
    redisClient.expire('admin', 180)
    adminAttemptCount = 0
    return res.status(200).send({
      message: 'Login succesfully.',
      email: email,
      scope: "admin",
      accessToken,
      refreshToken
    })
  }

  else {
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
}

module.exports = LOGIN;
