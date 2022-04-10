//import packages
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


// **** -> server config <- *******
const server = express();
const PORT = 8000 || process.env.PORT;


// *** -> MongoDB config <- ******
mongoose.connect("mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/student?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Mongodb connection succesfull !!");
}).catch(err => {
  console.log(err);
})

// user document schema
const userSchema = new mongoose.Schema({
  email: String,
  createOn: String
});

// Routine document schema
const RoutineSchema = new mongoose.Schema({
  module_name: String,
  lecturer_name: String,
  group: String,
  room_name: String,
  block_name: String,
  timing: String,
})


//create a userModel class
const UserModel = new mongoose.model("datas", userSchema);

//create a RoutineModel class
const RoutineModel = new mongoose.model("Routines", RoutineSchema);


//middleware 
server.use(express.json());


//default routing
server.get("/", (req, res) => {
  console.log("server started.....");
  res.send("server started....");
});


//verify jwt token
const VerifyJWT = (token, key) => {
  try {
    const res = jwt.verify(token, key);
    console.log("verification success")
  } catch (err) {
    console.log("Verification failed.......!!!");
  }
}


//generate jwt token
const GenerateJWT = (email) => {
  const token = jwt.sign({ id: email }, "routinemanagementsystem");
  return token;
}

// GenerateJWT("parbat@gmail.com")
// VerifyJWT(token, "routinemanagementsystem");


// *** ->> register new user <<- *****
const registerNewUser = (res, email) => {
  //upload data to mongodb
  const data = new UserModel({
    email: email,
    createdOn: new Date().toLocaleDateString()
  })

  // ->> upload the data to mongodb 
  data.save().then(() => {
    // sending response to the sender (frontend)
    return res.status(200).json({
      message: "Registration succesfull !!",
      token: GenerateJWT(email)
    });
  }).catch(err => {
    return res.status(500).send({
      message: "Registration failed !!",
      token: null
    });
  });
  
}

//login routing
server.post("/api/v4/Login", (req, res) => {
  // destructuring the incoming data 
  const { email } = req.body

  // ***** database data mapping *****
  UserModel.find({
    email: email
  }).then((data) => {
    if (data.length != 0) {
      res.status(200).send({
        message: "Login succesfull !!",
        token: GenerateJWT(email)
      });
      return;
    }
  }).catch(err => {
    res.status(500).send({
      message: "500 INTERNAL SERVER ERROR !!",
      token: null
    });
    return;
  });
 
  // if user not found in DB then register new user
  registerNewUser(res, email)

});

// ****** --> CRUD Routine Operation <-- *********


//post routine data
server.post("/api/v4/PostRoutineData", (req, res) => {
  //destructuring incoming data
  const { module_name, lecturer_name, group, room_name, block_name, timing } = req.body;
  
  const data = new RoutineModel({
    module_name: module_name,
    lecturer_name: lecturer_name,
    group: group,
    room_name: room_name,
    block_name: block_name,
    timing: timing
  });
  
  data.save().then(() => {
    res.status(200).send("Routine posted successfully !!");
  }).catch(err => {
    res.status(500).send(err);
  });
});


//get routine data
server.get("/api/v4/getRoutineData", (req, res) => {  
  // getting data collection from routine db
  RoutineModel.find().then((data) => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(500).send({
      message: "500 INTERNAL SERVER ERROR !!"
    });
  });
  
});

//get routine data
server.post("/api/v4/updateRoutineData", (req, res) => {
  //get the routine doc id
  const {routineID} = req.body;
});

//delete routine data
server.post("/api/v4/deleteRoutineData", (req, res) => {
  //get the routine doc id
  const { routineID } = req.body;
});




// ***** port listneer *****
server.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});






