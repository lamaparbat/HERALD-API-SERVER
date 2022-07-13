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
const auth = require('../src/middleware/auth');
const studentModel = require('../src/dbModel/studentModel');
const teacherModel = require('../src/dbModel/teacherModel');
const notifModel = require('../src/dbModel/notificationModel');
const adminModel = require('../src/dbModel/adminModel');
const feedbackModel = require('../src/dbModel/feedbackModel');
const routes = require("../src/routes/index.routes.js");

// **** -> server config <- *******
const server = express()
const PORT = process.env.PORT || 8000

//suspend state 
var studentAttemptCount = 1,
  teacherAttemptCount = 1;
var block_email = null;

//upload image name
var uploadFileName = null;

const pusher = new Pusher({
  appId: "1419323",
  key: "72d2952dc15a5dc49d46",
  secret: "ac6613086c0a1909c4a3",
  cluster: "ap2",
  useTLS: true
});

// *** -> MongoDB config <- ******
mongoose.connect( process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    }).then(() => {
    console.log('Mongodb connection succesfull !!')
  })
  .catch((err) => {
    console.log(err)
  });

// ***** -> Swagger config <- ******
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./api.yaml");

//middleware
server.use(express.json());
server.use(cookieParser());
server.use(routes);


// ********  image upload middleware ***********
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
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//default routing
server.get('/', (req, res) => {
  return res.send('Server has started...')
})

//login routing
server.post('/api/v4/student/Login', async (req, res) => {
  // destructuring the incoming data
  var { uid } = req.body;
  uid = uid.toUpperCase();

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
          email:data.email,
          group: data.group,
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
}):


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

// *********** ->  Teachers   <- **************
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
            const group = data["D"];
            //check if data already exists in db
            const searchResult = await studentModel.find({ uid: email });
            if (searchResult[0] === undefined) {
              //inserting into db
              const response = new studentModel({
                uid: data["B"] + "@HERALDCOLLEGE.EDU.NP",
                group:group
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
server.post("api/v4/uploadTeacherList", auth.VerifyJWT, (req, res) => {

});
server.post("api/v4/uploadAdminList", auth.VerifyJWT, (req, res) => {

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



//  ************: Fetch notifications ****************
server.post('/api/v4/getNotifications', auth.VerifyJWT, async (req, res) => {
  // destructure group
  const { group } = req.body;
  
  try {
    const result = await notifModel.find({ group: group })
    res.send(result);
  } catch (error) {
    res.status(404).send(error)
  }
})


// ***** port listneer *****
server.listen(PORT, () => {
  return console.log(`Listening to the port ${PORT}`)
});
