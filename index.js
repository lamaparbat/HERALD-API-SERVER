//import packages
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const jwt = require("./middleware/jwt.js");
const rmsLibrary = require("./rmsLibrary/index.js");
const studentModel = require("./dbModel/studentModel");
const teacherModel = require("./dbModel/teacherModel");
const routineModel = require("./dbModel/routineModel");
const notifModel = require("./dbModel/notificationModel");
const adminModel = require("./dbModel/adminModel");

// **** -> server config <- *******
const server = express();
const PORT = process.env.PORT || 8000;
var attemptCount = 1;

// *** -> MongoDB config <- ******
mongoose.connect("mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Mongodb connection succesfull !!");
}).catch(err => {
  console.log(err);
});

// *** -> Swagger config <- ******
const options = {
  swaggerDefinition: {
    info: {
      title: "Routine Management System API Docs",
      description: "API Documentation of Routine Management System consisting several CRUD featues and Authentication",
      contact: {
        name: "Parbat Lama"
      },
      servers: ["http://localhost:8000"]
    }
  },
  apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(options);

//middleware 
server.use(express.json());
server.use(cookieParser());
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//default routing
server.get("/", (req, res) => {
  console.log("server started.....");
  res.send("Server started");
});


//login routing
server.post("/api/v4/student/Login", async(req, res) => {
  // destructuring the incoming data 
  const { uid } = req.body;
  
  if (attemptCount <= 5) {
    //verify the uid
    if ((uid.includes("np") && uid.includes("heraldcollege.edu.np") === false)) {
      return res.status(400).send({
        message: "Unverified users.",
        token: null
      });
    }

    // ***** database data mapping *****
    try {
      const data = await studentModel.find({ uid: uid });
      if (data.length != 0) {
        //reset the attempt account
        attemptCount = 0;
        
        return res.status(200).send({
          message: "Login succesfull !!",
          token: jwt.GenerateJWT(uid)
        });
      } else {
        //increase the wrong email counter by 1
        attemptCount++;
        
        //if email counter reach 5, then store the cache
        if (attemptCount === 5) {
          setTimeout(() => {
            //reset the attemptCount after 5 minutes
            attemptCount = 0;
            console.log("Now you can login. => "+attemptCount)
          }, 300000)
        }
        
        return res.status(400).send({
          message: "Failed to login. Please use correct email !!",
          token: null
        });
      }
    } catch (error) {
      //if issue found on server, return message
      return res.status(500).send({
        message: "500 INTERNAL SERVER ERROR !!",
        token: null
      });
    }

    // if user not found in DB then register new user
    rmsLibrary.registerNewUser(res, uid);
  } else {
    res.status(500).send({
      message: "You exceed the 5 login attempt. !!"
    });
  }
});

//logout
server.post("/api/v4/Logout", async (req, res) => {
  //clear the cookies
  res.clearCookie();
  
  return res.status(200).send({
    message: "Logout succesfull !!"
  });
})


// ****** --> CRUD Routine Operation <-- *********
//post routine data
server.post("/api/v4/admin/postRoutineData", jwt.VerifyJWT, (req, res) => {
  //destructuring incoming data
  const { module_name, lecturer_name, group, room_name, block_name, timing } = req.body;
  
  const data = new routineModel({
    module_name: module_name,
    lecturer_name: lecturer_name,
    group: group,
    room_name: room_name,
    block_name: block_name,
    timing: timing,
    createdOn:new Date().toLocaleDateString()
  });
  
  data.save().then(async() => {
    //upload message to notification db
    const notifData = new notifModel({
      message: "Dear " + group + ", a new routine has recently published. Please see it once.",
      group:group,
      createdOn: new Date().toLocaleDateString()
    });
    
    try {
      const result = await notifData.save();
      if (result.message) {
        res.status(200).send({
          message: "Routine posted successfully !!"
        });
      }
    } catch (error) {
      res.status(500).send(err);
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});


//get routine data
server.get("/api/v4/routines/getRoutineData", jwt.VerifyJWT, (req, res) => {  
  //get the id
  const { uid } = req.body;
  
});

//update routine data
server.post("/api/v4/admin/updateRoutineData", jwt.VerifyJWT, (req, res) => {
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
        message: "Routine succesfully updated !!"
      });
    }
  })
});

//delete routine data
server.post("/api/v4/admin/deleteRoutineData", jwt.VerifyJWT, (req, res) => {
  //get the routine doc id
  const { routineID } = req.body;
  routineModel.remove({ _id: routineID }).then((data) => {
    res.status(200).send({
      message:"Routine succesfully deleted !!"
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
  adminModel.find({ email: email, password: password }).then(data => {
    if (data.length > 0) {
      res.status(200).send({
        message: "Login succesfully.",
        token:jwt.GenerateJWT(email)
      });

    } else {
      res.status(412).send("Wrong email or password !!");
    }
  });
});

//register new user
server.post("/api/v4/admin/Signup", (req, res) => {
  const { email, password } = req.body;
  
  //search if user already exists ?
  adminModel.find({ email: email }).then(data => {
    if (data.length === 0) {
      //insert new admin data
      const data = new adminModel({
        email: email,
        password: password,
        createdOn: new Date().toDateString()
      });
      
      //final upload to db
      data.save().then(() => {
        res.status(201).send("Admin created succesfully !!");
      }).catch(err => {
        res.status(500).send("500. SERVER ERROR!!");
      })
    } else {
      res.status(412).send("User already exists !!");
    }
  }).catch(err => {
    console.log("500 SERVER ERROR !!");
  })
  
  
});


// *********** ->  Student   <- **************
// Student Login
server.post("/api/v4/student/Login", (req, res) => {
  const { email, password } = req.body;

  //database mapping
  studentModel.find({ email: email, password: password }).then(data => {
    if (data.length > 0) {
      res.status(200).send({
        message: "Login succesfully.",
        token: jwt.GenerateJWT(email)
      });

    } else {
      res.status(412).send("Wrong email or password !!");
    }
  });
  
});

//register new Student 
server.post("/api/v4/student/Signup", (req, res) => {
  //search if user already exists ?
  studentModel.find({ email: email }).then(data => {
    if (data.length === 0) {
      //insert new admin data
      const data = new adminModel({
        email: email,
        password: password,
        createdOn: new Date().toDateString()
      });

      //final upload to db
      data.save().then(() => {
        res.status(201).send("Student created succesfully !!");
      }).catch(err => {
        res.status(500).send("500. SERVER ERROR!!");
      })
    } else {
      res.status(412).send("User already exists !!");
    }
  }).catch(err => {
    console.log("500 SERVER ERROR !!");
  })

});



// *********** ->  Teachers   <- **************
// Student Login
server.post("/api/v4/teacher/Login", (req, res) => {
  const { email, password } = req.body;

  //database mapping
  teacherModel.find({ email: email, password: password }).then(data => {
    if (data.length > 0) {
      res.status(200).send({
        message: "Login succesfully.",
        token: jwt.GenerateJWT(email)
      });

    } else {
      res.status(412).send("Wrong email or password !!");
    }
  });

});

//register new Student 
server.post("/api/v4/teacher/Signup", (req, res) => {
  //search if user already exists ?
  teacherModel.find({ email: email }).then(data => {
    if (data.length === 0) {
      //insert new admin data
      const data = new adminModel({
        email: email,
        password: password,
        createdOn: new Date().toDateString()
      });

      //final upload to db
      data.save().then(() => {
        res.status(201).send("Teachers created succesfully !!");
      }).catch(err => {
        res.status(500).send("500. SERVER ERROR!!");
      })
    } else {
      res.status(412).send("User already exists !!");
    }
  }).catch(err => {
    console.log("500 SERVER ERROR !!");
  })
});


// ***** port listneer *****
server.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});









