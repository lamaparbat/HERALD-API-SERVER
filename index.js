//import packages
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const studentModel = require("./dbModel/studentModel");
const routineModel = require("./dbModel/routineModel");


// **** -> server config <- *******
const server = express();
const PORT = process.env.PORT || 8000;


// *** -> MongoDB config <- ******
mongoose.connect("mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Mongodb connection succesfull !!");
}).catch(err => {
  console.log(err);
});


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
  const data = new studentModel({
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
    res.status(500).json({
      message: "Registration failed !!",
      token: null
    });
  }
  
}

//login routing
server.post("/api/v4/Login", async (req, res) => {
  // destructuring the incoming data 
  const { uid } = req.body;

  // ***** database data mapping *****
  try {
    const data = await studentModel.find({ uid: uid });
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
  
  const data = new routineModel({
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
  routineModel.find().then((data) => {
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
  routineModel.findByIdAndUpdate(routineID, {
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
  routineModel.remove({ _id: routineID }).then((data) => {
    res.status(200).send({
      message:"Routine Succesfully deleted !!"
    });
  }).catch(err => {
    res.status(500).send({
      message: "500 INTERNAL SERVER ERROR !!"
    });
  });
});


// *********** ->  admin   <- **************
// Admin Login
server.post("/api/v4/admin/Login", (req, res) => {
  const { email, password } = req.body;
  
  //database mapping
  
});

//register new user
server.post("/api/v4/admin/Signup", (req, res) => {
  const { email, password } = req.body;
  
  //database mapping 
  
});


// *********** ->  Student   <- **************
// Student Login
server.post("/api/v4/student/Login", (req, res) => {
  const { email, password } = req.body;

  //database mapping

});

//register new Student 
server.post("/api/v4/student/Signup", (req, res) => {
  const { email, password } = req.body;

  //database mapping 

});


// *********** ->  Teachers   <- **************
// Student Login
server.post("/api/v4/teacher/Login", (req, res) => {
  const { email, password } = req.body;

  //database mapping

});

//register new Student 
server.post("/api/v4/teacher/Signup", (req, res) => {
  const { email, password } = req.body;

  //database mapping 

});




// ***** port listneer *****
server.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});









