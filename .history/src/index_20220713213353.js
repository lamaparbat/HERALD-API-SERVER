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
const auth = require('../src/middleware/auth');
const notifModel = require('../src/dbModel/notificationModel');
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
