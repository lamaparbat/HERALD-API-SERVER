//import packages
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


// **** -> server config <- *******
const server = express();
const PORT = process.env.PORT || 3000;


// *** -> MongoDB config <- ******
mongoose.connect("mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Mongodb connection succesfull !!");
}).catch(err => {
  console.log(err);
})

// user document schema
const studentSchema = new mongoose.Schema({
  uid: String,
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
const UserModel = new mongoose.model("students", studentSchema);

//create a RoutineModel class
const RoutineModel = new mongoose.model("routines", RoutineSchema);


//middleware 
server.use(express.json());


//default routing
server.get("/", (req, res) => {
  console.log("server started.....");

  res.send("Server started");
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
const GenerateJWT = (uid) => {
  const token = jwt.sign({ id: uid }, process.env.TOP_SECRET_KEY);
  return token;
}


// *** ->> register new user <<- *****
const registerNewUser = async (res, uid) => {
  //upload data to mongodb
  const data = new UserModel({
    uid: uid,
    createdOn: new Date().toLocaleDateString()
  })
  
  try {
    // ->> upload the data to mongodb 
    const response = await data.save();
    
    // sending response to the sender (frontend)
    res.status(200).json({
      message: "Registration succesfull !!",
      token: GenerateJWT(uid)
    });
  } catch (error) {
    res.status(500).send({
      message: "Registration failed !!",
      token: null
    });
  }
  
}

//login routing
server.post("/api/v4/Login", async (req, res) => {
  // destructuring the incoming data 
  const {uid}  = req.body

  // ***** database data mapping *****
  try {
    const data = await UserModel.find({ uid: uid });
    if (data.length != 0) {
      res.status(200).send({
        message: "Login succesfull !!",
        token: GenerateJWT(uid)
      });
      return;
    }
  } catch (error) {
    //if issue found on server, return message
    res.status(500).send({
      message: "500 INTERNAL SERVER ERROR !!",
      token: null
    });
    return;
  }
  
  // if user not found in DB then register new user
  registerNewUser(res,uid);

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

//update routine data
server.post("/api/v4/updateRoutineData", (req, res) => {
  //get the routine doc id
  const { routineID, module_name } = req.body;
  RoutineModel.findByIdAndUpdate(routineID, {
    module_name: module_name
  }, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Internal Server Error !!"
      });
    } else {
      res.status(200).send({
        message: "Routine Succesfully updated !!"
      });
    }
  })
});

//delete routine data
server.post("/api/v4/deleteRoutineData", (req, res) => {
  //get the routine doc id
  const { routineID } = req.body;
  RoutineModel.remove({ _id: routineID }).then((data) => {
    res.status(200).send({
      message:"Routine Succesfully deleted !!"
    });
  }).catch(err => {
    res.status(500).send({
      message: "500 INTERNAL SERVER ERROR !!"
    });
  });
});


// admin CRUD
//delete routine data
server.post("/api/v4/admin/addUser", (req, res) => {
  res.send("null");
});




// ***** port listneer *****
server.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});









