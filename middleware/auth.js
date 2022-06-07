const jwt = require('jsonwebtoken')

//verify jwt token
const VerifyJWT = (req, res, next) => {
  //token validation
  if (req.header('authorization') === undefined || req.header('authorization').length <= 9) {
    res.status(404).send({
      message:"Token is empty !!"
    });
  } 
  var access_token = req.header('authorization')

  //remove the bearer text from token
  access_token = access_token.substr(7, access_token.length);
  
  
  try {
    const res = jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY)
    next()
  } catch (err) {
    res.status(404).send({
      message:"Session timeout."
    })
  }
}

//generate jwt token
const GenerateJWT = (uid) => {
  const access_token = jwt.sign({ id: uid }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "24h"
  })
  const refresh_token = jwt.sign({ id: uid }, process.env.REFRESH_TOKEN_KEY)
  
  return {
    access_token: access_token,
    refresh_token:refresh_token
  }
}

//regenerate the access token using refresh token
const regenerateAccessToken = (req, res, next) => {
  // fetch the refresh token
  var refresh_token = req.header("authorization")
  refresh_token = refresh_token.substr(14, refresh_token.length);
  
  //verify refresh token
  try {
    const response = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY);
    
    //regenerate the access token    
    req.body.uid = response.id
    
    //shift the process
    next()
  } catch (error) {
    res.status(404).send({
      message:"Refresh token cannot verified."
    })
  }
}

module.exports = { VerifyJWT, GenerateJWT, regenerateAccessToken }
