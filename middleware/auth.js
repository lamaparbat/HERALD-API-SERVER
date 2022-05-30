const jwt = require("jsonwebtoken");

//verify jwt token
const VerifyJWT = (req, res, next) => {
 var token = req.header("authorization");

 //remove the bearer text from token
 token = token.substr(7, token.length)
 try {
  jwt.verify(token, process.env.TOP_SECRET_KEY);
  console.log("verification success");
  next();
 } catch (err) {
  console.log("Verification failed.......!!!");
 }
}


//generate jwt token
const GenerateJWT = (uid) => {
 const token = jwt.sign({ id: uid }, process.env.TOP_SECRET_KEY);
 return token;
}

module.exports = { VerifyJWT, GenerateJWT }