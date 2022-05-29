const studentModel = require("../dbModel/studentModel");

// register new user
const registerNewUser = async (res, uid) => {
 //upload data to mongodb
 const data = await new studentModel({
  uid: uid,
  createdOn: new Date().toLocaleDateString()
 });

 try {
  // ->> upload the data to mongodb 
  const response = await data.save();

  // sending response to the sender (frontend)
  return res.status(200).send({
   message: "Registration succesfull !!"
  });
 } catch (error) {
  return res.status(500).send({
   message: "Registration failed !!"
  });
 }
}





module.exports = {registerNewUser}