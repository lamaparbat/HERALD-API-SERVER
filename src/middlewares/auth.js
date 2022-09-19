const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../configs/index.config");
const feedbackAuth = require("./feedbackAuth");
const reverseWord = require('../utils/reverseWord')


//verify jwt token
const VerifyJWT = (scope) => {
  return async (req, res, next) => {
    //token validation
    if (req.header('authorization') === undefined || req.header('authorization').length <= 9) {
      return res.status(404).send({
        message: "Token is empty !!"
      });
    }
    
    const token = req.header('authorization');
    //if token is not present or if token does not start with bearer then we send the error
    if (!token && !token.toLowerCase().startswith('bearer')) {
      return res.status(404).send({ error: 'invalid token' })
    }

    //remove the bearer text from token
    const accessToken = token.substr(7);

    try {
      /**
       * the result variable will be populated with the object that we passed when we created the token 
       * with the GenerateJwt function
       */
      
      const result = await jwt.verify(accessToken, ACCESS_TOKEN_KEY);
      /**
       * Checking if our scope exists in the array of scopes
       * if it does we add scope property to our req object
       * and send the request to the next main LOGIN controller
       */
      if (scope.includes(reverseWord(result.scope))) {
        req.scope = result.scope

        next()
        /**
         * if our scope does not exists in the array of scope
         * then we send an error message as a response
         */
      } else {

        return res.status(403).send({ message: "Insufficient scope !!" });
      }
      /**
       * jwt.verify will throw an error if the token is invalid 
       * this catch handler will catch that error and pass it to the error handling middleware
       * if token is invalid the error equals to => JsonWebTokenError
       * if token has expired the error is => TokenExpiredError
       */
    } catch (err) {

      next(err)
    }
  }

}

//generate jwt token
const GenerateJWT = (scope, uid) => {
  const accessToken = jwt.sign({ id: uid, scope: reverseWord(scope) }, ACCESS_TOKEN_KEY, {
    expiresIn: "24h"
  });
  const refreshToken = jwt.sign({ id: uid, scope: reverseWord(scope) }, REFRESH_TOKEN_KEY);

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
