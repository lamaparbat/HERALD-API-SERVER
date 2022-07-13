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
const routes = require("../src/routes/index.routes.js");

// **** -> server config <- *******
const server = express();
const PORT = process.env.PORT || 8000;

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
