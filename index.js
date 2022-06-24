//import packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const fs = require("fs");
const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const Pusher = require("pusher");
const xlsx2json = require('xlsx2json');
const auth = require('./middleware/auth.js');
const studentModel = require('./dbModel/studentModel');
const teacherModel = require('./dbModel/teacherModel');
const routineModel = require('./dbModel/routineModel');
const notifModel = require('./dbModel/notificationModel');
const adminModel = require('./dbModel/adminModel');
const feedbackModel = require('./dbModel/feedbackModel');

// **** -> server config <- *******
const server = express()
const PORT = process.env.PORT || 8000

//suspend state 
var studentAttemptCount = 1,
  teacherAttemptCount = 1;
var block_email = null;

//upload image name
var uploadFileName = null;

// socket connection api
const pusher = new Pusher({
  appId: "1419323",
  key: "72d2952dc15a5dc49d46",
  secret: "ac6613086c0a1909c4a3",
  cluster: "ap2",
  useTLS: true
});

// *** -> MongoDB config <- ******
mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    }
  )
  .then(() => {
    console.log('Mongodb connection succesfull !!')
  })
  .catch((err) => {
    console.log(err)
  });

// *** -> Swagger config <- ******
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./api.yaml");

//middleware
server.use(express.json());
server.use(cookieParser());


// ********  image upload middleware **********
//create storage instance
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    uploadFileName = Date.now() + "-" + file.originalname;
    cb(null, uploadFileName);
  }
});
const feedbackUpload = multer({ storage: storage1 });

// upload college data
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "collegeData");
  },
  filename: (req, file, cb) => {
    uploadFileName = Date.now() + "-" + file.originalname;
    cb(null, uploadFileName);
  }
});
const collegeUpload = multer({ storage: storage2 });


server.use(
  cors({
    origin: [process.env.LOCALHOST, process.env.WEB_URL],
  })
)
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//default routing
server.get('/', (req, res) => {
  return res.send('Server has started...')
})

//login routing
server.post('/api/v4/student/Login', async (req, res) => {
  // destructuring the incoming data
  try {
    var { uid } = req.body;
    uid = uid.toUpperCase();
  } catch (error) {
    return res.status(404).send("Please pass the student uid");
  }  
  //uid validation
  if (typeof uid !== "string") {
    return res.status(400).send("Please enter email in string format.")
  }
  
  // excess attempt check
  if (studentAttemptCount <= 5 && block_email !== uid) {
    //verify the uid
    if ((uid.includes('NP') && uid.includes('HERALDCOLLEGE.EDU.NP')) === false) {
      return res.status(400).json({
        message: 'Unverified users.',
        token: null,
      });
    }


    // ***** database data mapping *****
    try {
      const data = await studentModel.find({ uid: uid })

      if (data.length !== 0) {
        //reset the attempt account details
        studentAttemptCount = 0;
        block_email = null;

        //generate the token
        const { access_token, refresh_token } = auth.GenerateJWT(uid);

        return res.status(200).send({
          message: 'Login succesfull !!',
          access_token: access_token,
          refresh_token: refresh_token
        });
      } else {
        //increase the wrong email counter by 1
        studentAttemptCount++
        //if email counter reach 5, then store the cache
        if (studentAttemptCount === 5) {
          setTimeout(() => {
            //reset the attemptCount after 5 minutes
            attemptCount = 0;
            block_email = null;

            console.log('Now you can login. => ' + studentAttemptCount);
          }, 300000);
        }

        return res.status(400).send({
          message: 'Failed to login. Please use correct email !!',
          token: null,
        })
      }
    } catch (error) {
      //if issue found on server, return message
      return res.status(500).send({
        message: '500 INTERNAL SERVER ERROR !!',
        token: null,
      })
    }
  } else {
    block_email = uid;
    studentAttemptCount = 0;
    return res.status(500).send({
      message: 'You exceed the 5 login attempt. Please try again after 5 min !!',
    })
  }
})

//logout
server.post('/api/v4/Logout', async (req, res) => {
  //clear the cookies
  res.clearCookie()

  return res.status(200).send({
    message: 'Logout succesfull !!',
  })
})


//request for regenerate access token
server.put("/api/v4/RegenerateToken", auth.regenerateAccessToken, async (req, res) => {
  const { uid } = req.body;

  //generate the token
  const { access_token, refresh_token } = auth.GenerateJWT(uid);

  return res.status(200).send({
    message: 'Token regenerated succesfully !!',
    access_token: access_token,
    refresh_token: refresh_token
  });
})


// ****** --> CRUD Routine Operation <-- *********
//post routine data
server.post('/api/v4/admin/postRoutineData', auth.VerifyJWT, async (req, res) => {
  //destructuring incoming data
  const {
    course_type,
    module_name,
    lecturer_name,
    class_type,
    group,
    room_name,
    block_name,
    day,
    start_time,
    end_time,
  } = req.body

  //check if all attributes are recieved or not ?
  if (Object.keys(req.body).length < 9) {
    return res
      .status(404)
      .send('Some fields are missing. Please provide all the fields !!')
  }

  //minor validation
  if (
    course_type.length > 0 &&
    module_name.length > 0 &&
    lecturer_name.length > 0 &&
    class_type.length > 0 &&
    group.length > 0 &&
    room_name.length > 0 &&
    day.length > 0 &&
    start_time.length > 0 &&
    end_time.length > 0 &&
    block_name.length > 0
  ) {
    const data = new routineModel({
      course_type: course_type.toUpperCase(),
      module_name: module_name.toUpperCase(),
      lecturer_name: lecturer_name,
      class_type: class_type.toUpperCase(),
      group: group.toUpperCase(),
      room_name: room_name.toUpperCase(),
      block_name: block_name,
      day: day.toUpperCase(),
      start_time: start_time,
      end_time: end_time,
      createdOn: new Date().toLocaleDateString(),
    });

    const result = await routineModel.find({ createdOn: new Date().toLocaleDateString(), day: day, module_name: module_name });
    if (result.length > 0) {
      res.status(404).send(`Routine of ${module_name} for the date ${new Date().toLocaleDateString()} has already been created.`)
    }

    data.save().then(async () => {
      //upload message to notification db
      const notifData = new notifModel({
        message: `Dear ${group} of ${course_type}, a new routine of ${module_name} has recently published. Please see it once.`,
        group: group,
        createdOn: new Date().toLocaleDateString(),
      })

      try {
        const result = await notifData.save()
        if (result.message) {
          pusher.trigger("my-channel", "notice", {
            message: `Dear ${group} of ${course_type}, a new routine of ${module_name} has recently published. Please see it once.`
          });
          return res.status(200).send({
            message: 'Routine posted successfully !!',
          })
        }
      } catch (error) {
        return res.status(500).send(err)
      }
    })
      .catch((err) => {
        return res.status(500).send(err)
      })
  } else {
    return res.status(403).send('Please fill all the field !!')
  }
})

//get all routine data
server.get('/api/v4/routines/getRoutineData', auth.VerifyJWT, async (req, res) => {
  //fetch all routine from db
  const result = await routineModel.find()

  if (result.length != 0) {
    return res.status(200).send({
      data: result,
    })
  } else {
    return res.status(200).send({
      message: 'Result: 0 found !!',
    })
  }
}
);

//get the routine data based on level wise
server.get(
  '/api/v4/routines/getRoutineByLevel',
  auth.VerifyJWT,
  async (req, res) => {
    // destructuring the level from headers
    const level = `L${req.headers.level}`;

    //fetch all routine from db
    const result = await routineModel.find();

    const filterData = result.filter(data => {
      return data.group.includes(level);
    })

    if (filterData.length != 0) {
      return res.status(200).send({
        data: filterData,
      })
    } else {
      return res.status(404).send({
        message: 'Result: 0 found !!',
      })
    }
  }
);

//get the routine data based on level wise
server.get(
  '/api/v4/routines/getRoutineByGroup',
  auth.VerifyJWT,
  async (req, res) => {
    // destructuring the level from headers
    const group = `G${req.headers.group}`;

    //fetch all routine from db
    const result = await routineModel.find();

    const filterData = result.filter(data => {
      return data.group.includes(group);
    })

    if (filterData.length != 0) {
      return res.status(200).send({
        data: filterData,
      })
    } else {
      return res.status(404).send({
        message: 'Result: 0 found !!',
      })
    }
  }
);

//update routine data
server.put('/api/v4/admin/updateRoutineData', auth.VerifyJWT, (req, res) => {
  //get the routine doc id
  const {
    course_type,
    module_name,
    lecturer_name,
    class_type,
    group,
    room_name,
    block_name,
    day,
    start_time,
    end_time,
  } = req.body;

  routineModel.findByIdAndUpdate(
    routineID,
    {
      course_type: course_type.toUpperCase(),
      module_name: module_name.toUpperCase(),
      lecturer_name: lecturer_name,
      class_type: class_type.toUpperCase(),
      group: group.toUpperCase(),
      room_name: room_name.toUpperCase(),
      block_name: block_name,
      day: day.toUpperCase(),
      start_time: start_time,
      end_time: end_time,
      createdOn: new Date().toLocaleDateString(),
    },
    (err, data) => {
      if (err) {
        return res.status(500).send({
          message: 'Internal Server Error !!',
        })
      } else {
        return res.status(200).send({
          message: 'Routine succesfully updated !!',
        })
      }
    }
  )
})

//delete routine data
server.delete('/api/v4/admin/deleteRoutineData', auth.VerifyJWT, (req, res) => {
  //get the routine doc id
  const { routineID } = req.body
  routineModel
    .remove({ _id: routineID })
    .then((data) => {
      return res.status(200).send({
        message: 'Routine succesfully deleted !!',
      })
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'Failed to delete routine !!',
      })
    })
})

// search routine by id
server.get('/api/v4/routines/searchRoutine', auth.VerifyJWT, async (req, res) => {
  const { module_name, group } = req.headers

  //search routine in db
  const result = await routineModel.find({
    module_name: module_name,
    group: group,
  })

  if (result.length != 0) {
    return res.status(200).send({
      data: result,
    })
  } else {
    return res.status(404).send({
      message: 'Routine not found !!',
    })
  }
}
)

// *********** ->  admin   <- **************
// Admin Login
server.post('/api/v4/admin/Login', (req, res) => {
  const { email, password } = req.body
  
  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    console.log(email.includes("gmail"))
    return res.status(400).send("Client side validation issues. Please carefully send the right format of email and password !!")
  }
  
  //email validation
  if (!(email.includes("gmail") && email.includes("@") && email.indexOf("@") < email.indexOf("gmail"))) {
    return res.status(404).send("Email validation error. please type correct email format !")
  }


  //database mapping
  adminModel.find({ email: email, password: password }).then((data) => {
    if (data.length > 0) {
      return res.status(200).send({
        message: 'Login succesfully.',
        token: auth.GenerateJWT(email),
      })
    } else {
      return res.status(412).send('Wrong email or password !!')
    }
  })
})

//register new user
server.post('/api/v4/admin/Signup', (req, res) => {
  const { email, password } = req.body

  //search if user already exists ?
  adminModel
    .find({ email: email })
    .then((data) => {
      if (data.length === 0) {
        //insert new admin data
        const data = new adminModel({
          email: email,
          password: password,
          createdOn: new Date().toDateString(),
        })

        //final upload to db
        data
          .save()
          .then(() => {
            return res.status(201).send('Admin created succesfully !!');
          })
          .catch((err) => {
            return res.status(500).send('500. SERVER ERROR!!');
          })
      } else {
        return res.status(412).send('User already exists !!');
      }
    })
    .catch((err) => {
      console.log('500 SERVER ERROR !!');
    })
})

// *********** ->  Teachers   <- ***************
// Teacher Login
server.post('/api/v4/teacher/Login', async (req, res) => {
  const { email, password } = req.body

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).send("Client side validation issues. Please carefully send the right format of email and password !!")
  }
  
  //email validation
  if (!(email.includes("gmail") && email.includes("@") && email.indexOf("@") < email.indexOf("gmail"))) {
    return res.status(404).send("Email validation error. please type correct email format !")
  }

  if (teacherAttemptCount <= 5) {
    //database mapping
    teacherModel.find({ email: email, password: password }).then((data) => {
      if (data.length > 0) {
        return res.status(200).send({
          message: 'Login succesfully.',
          token: auth.GenerateJWT(email),
        })
      } else {
        teacherAttemptCount++
        return res.status(412).send('Wrong email or password !!')
      }
    })
  } else {
    return res.status(500).send({
      message:
        'You exceed the 5 login attempt. Please wait for 5 min to retry again !!',
    })
  }
});

//register new Teacher
server.post('/api/v4/teacher/Signup', (req, res) => {
  //search if user already exists ?
  teacherModel
    .find({ email: email })
    .then((data) => {
      if (data.length === 0) {
        //insert new admin data
        const data = new adminModel({
          email: email,
          password: password,
          createdOn: new Date().toDateString(),
        })

        //final upload to db
        data
          .save()
          .then(() => {
            return res.status(201).send('Teachers created succesfully !!')
          })
          .catch((err) => {
            return res.status(500).send('500. SERVER ERROR!!')
          })
      } else {
        return res.status(412).send('User already exists !!')
      }
    })
    .catch((err) => {
      return console.log('500 SERVER ERROR !!')
    })
});



// ********** UPLOAD COLLEGE DATA ************
server.post("/api/v4/uploadStudentList", auth.VerifyJWT, collegeUpload.single("file"), async (req, res) => {
  try {
    xlsx2json(`collegeData/${uploadFileName}`).then(jsonArray => {
      jsonArray.map(async (array) => {
        await array.map(async (data) => {
          if (data["A"] !== "S.N.") {
            const email = data["B"] + "@HERALDCOLLEGE.EDU.NP";
            //check if data already exists in db
            const searchResult = await studentModel.find({ uid: email });
            if (searchResult[0] === undefined) {
              //inserting into db
              const response = new studentModel({
                uid: data["B"] + "@HERALDCOLLEGE.EDU.NP"
              });

              try {
                const result = await response.save();
              } catch (error) {
                res.status(500).send("SERVER ERORR !!");
              }
            }
          }
        });
      });

      //delete the file
      fs.unlinkSync(`collegeData/${uploadFileName}`);

      res.status(200).send("Data extracted and import to DB successfully.")
    });
  } catch (error) {
    //delete the file
    fs.unlinkSync(`collegeData/${uploadFileName}`);
    res.status(500).send("Failed to parse the given file. Please upload the xlsx formate file only !!")
  }
});
server.post("/api/v4/routines/uploadRoutineList", auth.VerifyJWT, collegeUpload.single("file"), async (req, res) => {
  try {
    xlsx2json(`collegeData/${uploadFileName}`).then(jsonArray => {
      jsonArray.map(async (array) => {
        await array.map(async (data) => {
          if (data["A"].length > 0) {
            console.log(data)
          }
        });
      });

      //delete the file
      fs.unlinkSync(`collegeData/${uploadFileName}`);

      res.status(200).send("Routine extracted and import to DB successfully.")
    });
  } catch (error) {
    //delete the file
    fs.unlinkSync(`collegeData/${uploadFileName}`);
    res.status(500).send("Failed to parse the given file. Please upload the xlsx formate file only !!")
  }
});

// ********** USER FEEDBACK *************
server.post('/api/v4/feedback/postFeedback', auth.VerifyJWT, collegeUpload.single('file'), async (req, res) => {
  // destructuring the binded data
  const { report_type, description } = req.body;

  // validation
  if (Object.keys(req.body).length < 7) {
    if (report_type.length > 3 && description.length > 3 && uploadFileName !== null) {
      //db insertion
      const data = new feedbackModel({
        report_type: report_type,
        description: description,
        file: uploadFileName
      });

      //save the data
      data.save().then(() => {
        res.status(200).send({
          message: "Feedback posted successfully !!"
        });
      }).catch(err => {
        res.status(500).send({
          message: "500 BACKEND SERVER ERROR !!"
        });
      });
    } else {
      res.status(404).send({
        message: "Validaton issues."
      });
    }
  } else {
    res.status(404).send({
      message: "Some fields are missing."
    });
  }
});

server.get('/api/v4/feedback/getFeedback', auth.VerifyJWT, collegeUpload.single('file'), async (req, res) => {
  //db mapping
  const data = await feedbackModel.find();

  if (data.length != 0) {
    return res.status(200).send({
      data: data,
    })
  } else {
    return res.status(404).send({
      message: 'Result: 0 found !!',
    })
  }
});

server.delete('/api/v4/feedback/deleteFeedback', auth.VerifyJWT, collegeUpload.single('file'), async (req, res) => {
  const { feedbackid, filename } = req.headers;

  //delete feedback post using id
  try {
    feedbackModel.deleteOne({ _id: feedbackid }, (err, doc) => {
      if (err) {
        return res.status(500).send("Invalid feedback ID !!");
      } else {
        //deleting local file 
        fs.unlinkSync(`uploads/${filename}`)
        return res.status(200).send("Routine deleted successfully !!");
      }
    });
  } catch (error) {
    return res.status(200).send('500 INTERNAL SERVER ERROR !!');
  }
});


// ***** port listneer *****
server.listen(PORT, () => {
  return console.log(`Listening to the port ${PORT}`)
});
