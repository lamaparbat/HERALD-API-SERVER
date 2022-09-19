const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../configs/index.config");
const feedbackAuth = require("./feedbackAuth");


//verify jwt token
const VerifyJWT = (scope) => {
  return async (req, res, next) => {
    //token validation
    if (req.header('authorization') === undefined || req.header('authorization').length <= 9) {
      return res.status(404).send({
        message: "Token is empty !!"
      });
    }
    var accessToken = req.header('authorization');

    //remove the bearer text from token
    accessToken = accessToken.substr(7, accessToken.length);

    try {
      const result = await jwt.verify(accessToken, ACCESS_TOKEN_KEY);
      if (!scope.includes(result.scope)) {
        return res.status(403).send({ message: "Insufficient scope !!" });
      }
      req.scope = scope;
      next();
    } catch (err) {
      console.log(err.message)
      return res.status(404).send({ message: err.message});
    }
  }

}

//generate jwt token
const GenerateJWT = (scope, uid) => {
  const accessToken = jwt.sign({ id: uid, scope: scope }, ACCESS_TOKEN_KEY, {
    expiresIn: "24h"
  });
  const refreshToken = jwt.sign({ id: uid, scope: scope }, REFRESH_TOKEN_KEY);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}


//regenerate the access token using refresh token
const regenerateAccessToken = (req, res, next) => {
  // fetch the refresh token
  var refreshToken = req.header("authorization");
  refreshToken = refreshToken.substr(14, refreshToken.length);
  //verify refresh token
  try {
    const response = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);

    //regenerate the access token    
    req.body.uid = response.id;

    //shift the process
    next();
  } catch (error) {
    res.status(403).send({ message: error.message });
  }
}


module.exports = { VerifyJWT, GenerateJWT, regenerateAccessToken, feedbackAuth }
