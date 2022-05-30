//import packages
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const auth = require("./middleware/auth.js");
const rmsLibrary = require("./rmsLibrary/registerUser.js");
const studentModel = require("./dbModel/studentModel");
const teacherModel = require("./dbModel/teacherModel");
const routineModel = require("./dbModel/routineModel");
const notifModel = require("./dbModel/notificationModel");
const adminModel = require("./dbModel/adminModel");

// **** -> server config <- *******
const server = express();
const PORT = process.env.PORT || 8000;
var studentAttemptCount = 1, teacherAttemptCount = 1;

// *** -> MongoDB config <- ******
mongoose.connect("mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }).then(() => {
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
  return res.send("Server has started...");
});


//login routing
server.post("/api/v4/student/Login", async (req, res) => {
  // destructuring the incoming data 
  const { uid } = req.body;

  if (studentAttemptCount <= 5) {
    //verify the uid
    (uid.includes("np") && uid.includes("heraldcollege.edu.np")) === false ? res.status(400).json({
      message: "Unverified users.",
      token: null
    }) : null

    // ***** database data mapping *****
    try {
      const data = await studentModel.find({ uid: uid });

      if (data.length !== 0) {
        //reset the attempt account
        studentAttemptCount = 0;

        return res.status(200).send({
          message: "Login succesfull !!",
          token: auth.GenerateJWT(uid)
        });
      } else {
        //increase the wrong email counter by 1
        studentAttemptCount++;

        //if email counter reach 5, then store the cache
        if (studentAttemptCount === 5) {
          setTimeout(() => {
            //reset the attemptCount after 5 minutes
            attemptCount = 0;
            console.log("Now you can login. => " + studentAttemptCount)
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
  } else {
    return res.status(500).send({
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
server.post("/api/v4/admin/postRoutineData", auth.VerifyJWT, (req, res) => {
  //destructuring incoming data
  const { module_name, lecturer_name, group, room_name, block_name, start_time, end_time } = req.body;
  
  //check if all attributes are recieved or not ?
  if (Object.keys(req.body).length < 7) {
    return res.status(404).send("Some fields are missing. Please provide all the fields !!");
  }
  
  //minor validation
  if (module_name.length > 0 && lecturer_name.length > 0 && group.length > 0 && room_name.length > 0 && start_time.length > 0 && end_time.length > 0 && block_name.length > 0) {
    const data = new routineModel({
      module_name: module_name.toUpperCase(),
      lecturer_name: lecturer_name,
      group: group.toUpperCase(),
      room_name: room_name.toUpperCase(),
      block_name: block_name,
      start_time: start_time,
      end_time: end_time,
      createdOn: new Date().toLocaleDateString()
    });

    data.save().then(async () => {
      //upload message to notification db
      const notifData = new notifModel({
        message: "Dear " + group + ", a new routine has recently published. Please see it once.",
        group: group,
        createdOn: new Date().toLocaleDateString()
      });

      try {
        const result = await notifData.save();
        if (result.message) {
          return res.status(200).send({
            message: "Routine posted successfully !!"
          });
        }
      } catch (error) {
        return res.status(500).send(err);
      }
    }).catch(err => {
      return res.status(500).send(err);
    });
  } else {
    return res.status(403).send("Please fill all the field !!");
  }
});



//get all routine data
server.get("/api/v4/routines/getRoutineData", auth.VerifyJWT, async (req, res) => {
  //fetch all routine from db
  const result = await routineModel.find();

  if (result.length != 0) {
    return res.status(200).send({
      data: result
    })
  } else {
    return res.status(404).send({
      message: "Result: 0 found !!"
    });
  }

});


//update routine data
server.post("/api/v4/admin/updateRoutineData", auth.VerifyJWT, (req, res) => {
  //get the routine doc id
  const { routineID, module_name } = req.body;
  routineModel.findByIdAndUpdate(routineID, {
    module_name: module_name
  }, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: "Internal Server Error !!"
      });
    } else {
      return res.status(200).send({
        message: "Routine succesfully updated !!"
      });
    }
  })
});

//delete routine data
server.delete("/api/v4/admin/deleteRoutineData", auth.VerifyJWT, (req, res) => {
  //get the routine doc id
  const { routineID } = req.body;
  routineModel.remove({ _id: routineID }).then((data) => {
    return res.status(200).send({
      message: "Routine succesfully deleted !!"
    });
  }).catch(err => {
    return res.status(500).send({
      message: "500 INTERNAL SERVER ERROR !!"
    });
  });
});

// search routine by id
server.get("/api/v4/routines/searchRoutine", auth.VerifyJWT, async (req, res) => {
  const { module_name, group } = req.headers;

  //search routine in db 
  const result = await routineModel.find({ module_name: module_name, group: group });

  if (result.length != 0) {
    return res.status(200).send({
      data: result
    })
  } else {
    return res.status(404).send({
      message: "Routine not found !!"
    });
  }

});



// *********** ->  admin   <- **************
// Admin Login
server.post("/api/v4/admin/Login", (req, res) => {
  const { email, password } = req.body;

  //database mapping
  adminModel.find({ email: email, password: password }).then(data => {
    if (data.length > 0) {
      return res.status(200).send({
        message: "Login succesfully.",
        token: auth.GenerateJWT(email)
      });

    } else {
      return res.status(412).send("Wrong email or password !!");
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
        return res.status(201).send("Admin created succesfully !!");
      }).catch(err => {
        return res.status(500).send("500. SERVER ERROR!!");
      })
    } else {
      return res.status(412).send("User already exists !!");
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
      return res.status(200).send({
        message: "Login succesfully.",
        token: auth.GenerateJWT(email)
      });

    } else {
      return res.status(412).send("Wrong email or password !!");
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
        return res.status(201).send("Student created succesfully !!");
      }).catch(err => {
        return res.status(500).send("500. SERVER ERROR!!");
      })
    } else {
      return res.status(412).send("User already exists !!");
    }
  }).catch(err => {
    console.log("500 SERVER ERROR !!");
  })

});



// *********** ->  Teachers   <- **************
// Student Login
server.post("/api/v4/teacher/Login", async (req, res) => {
  const { email, password } = req.body;

  if (teacherAttemptCount <= 5) {
    //database mapping
    teacherModel.find({ email: email, password: password }).then(data => {
      if (data.length > 0) {
        return res.status(200).send({
          message: "Login succesfully.",
          token: auth.GenerateJWT(email)
        });

      } else {
        teacherAttemptCount++;
        return res.status(412).send("Wrong email or password !!");
      }
    });
  } else {
    return res.status(500).send({
      message: "You exceed the 5 login attempt. Please wait for 5 min to retry again !!"
    });
  }

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
        return res.status(201).send("Teachers created succesfully !!");
      }).catch(err => {
        return res.status(500).send("500. SERVER ERROR!!");
      })
    } else {
      return res.status(412).send("User already exists !!");
    }
  }).catch(err => {
    return console.log("500 SERVER ERROR !!");
  })
});


// ***** port listneer *****
server.listen(PORT, () => {
  return console.log(`Listening to the port ${PORT}`);
});









