const res = require("express/lib/response");

// register new user
const registerNewUser = async (res, uid) => {
 //upload data to mongodb
 const data = new studentModel({
  uid: uid,
  createdOn: new Date().toLocaleDateString()
 });

 try {
  // ->> upload the data to mongodb 
  const response = await data.save();

  // sending response to the sender (frontend)
  res.status(200).json({
   message: "Registration succesfull !!"
  });
 } catch (error) {
  res.status(500).json({
   message: "Registration failed !!"
  });
 }
}





module.exports = {registerNewUser}