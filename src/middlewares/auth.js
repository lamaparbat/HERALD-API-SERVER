const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../configs/index.config");
const { SCOPE } = require("../constants/index");
const reverseWord = require('../utils/reverseWord');

const STUDENT_TOKEN = {
  ACCESS_TOKEN: [],
  REFRESH_TOKEN: []
}
const TEACHER_TOKEN = {
  ACCESS_TOKEN: [],
  REFRESH_TOKEN: []
}
const ADMIN_TOKEN = {
  ACCESS_TOKEN: [],
  REFRESH_TOKEN: []
}


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
    
    // shallow copy
    let shallow = accessToken;
    
    // session timeout check
    if (accessToken.includes(reverseWord(SCOPE.STUDENT_SCOPE))) {
      if (!STUDENT_TOKEN.ACCESS_TOKEN.includes(accessToken)) return res.status(404).send({ message: "Session timeout !!" });
      accessToken = accessToken.split(reverseWord(SCOPE.STUDENT_SCOPE))[0];
    } else if (accessToken.includes(reverseWord(SCOPE.TEACHER_SCOPE))) {
      if (!TEACHER_TOKEN.ACCESS_TOKEN.includes(accessToken)) return res.status(404).send({ message: "Session timeout !!" });
      accessToken = accessToken.split(reverseWord(SCOPE.TEACHER_SCOPE))[0];
    } else if (accessToken.includes(reverseWord(SCOPE.ADMIN_SCOPE))) {
      if (!ADMIN_TOKEN.ACCESS_TOKEN.includes(accessToken)) return res.status(404).send({ message: "Session timeout !!" });
      accessToken = accessToken.split(reverseWord(SCOPE.ADMIN_SCOPE))[0];
    }

    
    // scope validation
    let shuffledScopes = reverseWord(scope);   // ["ram","hari"] => ["mar","irah"]
    let extractedScopeFromToken = shallow.substr(accessToken.length, accessToken.length + scope.length);
    
    if (!shuffledScopes.includes(extractedScopeFromToken)) {
      return res.status(403).send({ message: "Insufficient scope !!" });
    }

    try {
      const res = await jwt.verify(accessToken, ACCESS_TOKEN_KEY);
      req.scope = extractedScopeFromToken;
      next();
    } catch (err) {
      console.log(err)
      return res.status(404).send({ message: "Unverified token !!" });
    }
  }

}

//generate jwt token
const GenerateJWT = (scope, uid) => {
  const accessToken = jwt.sign({ id: uid }, ACCESS_TOKEN_KEY, {
    expiresIn: "24h"
  });
  const refreshToken = jwt.sign({ id: uid }, REFRESH_TOKEN_KEY);

  // store token
  storeToken(scope, accessToken + reverseWord(scope), refreshToken + reverseWord(scope));

  return {
    accessToken: accessToken + reverseWord(scope),
    refreshToken: refreshToken + reverseWord(scope)
  }
}


//regenerate the access token using refresh token
const regenerateAccessToken = (req, res, next) => {
  // fetch the refresh token
  var refreshToken = req.header("authorization");
  refreshToken = refreshToken.substr(14, refreshToken.length);

  if (STUDENT_TOKEN.REFRESH_TOKEN.includes(refreshToken) === false
    && TEACHER_TOKEN.REFRESH_TOKEN.includes(refreshToken) === false
    && ADMIN_TOKEN.REFRESH_TOKEN.includes(refreshToken) === false) {
    res.status(404).send({ message: "Sessiom timeout." });
  }

  //verify refresh token
  try {
    const response = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);

    //regenerate the access token    
    req.body.uid = response.id;

    //shift the process
    next();
  } catch (error) {
    res.status(403).send({ message: "Unverified refresh token." });
  }
}


// scope based token differentiation
const storeToken = (scope, accessToken, refreshToken) => {
  if (scope === SCOPE.STUDENT_SCOPE) {
    STUDENT_TOKEN.ACCESS_TOKEN.push(accessToken);
    STUDENT_TOKEN.REFRESH_TOKEN.push(refreshToken);
  } else if (scope === SCOPE.TEACHER_SCOPE) {
    TEACHER_TOKEN.ACCESS_TOKEN.push(accessToken);
    TEACHER_TOKEN.REFRESH_TOKEN.push(refreshToken);
  } else {
    ADMIN_TOKEN.ACCESS_TOKEN.push(accessToken);
    ADMIN_TOKEN.REFRESH_TOKEN.push(refreshToken);
  }

  return;
}




module.exports = { VerifyJWT, GenerateJWT, regenerateAccessToken }
