//import packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const Pusher = require("pusher");
const routes = require("../src/routes/index.routes.js");
const { START_DB_CONNECTION } = require("../src/utils");

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


// start mongodb server connection
START_DB_CONNECTION();


// ***** -> Swagger config <- ******
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./api.yaml");

//middleware
server.use(express.json());
server.use(cookieParser());
server.use(routes);
server.use(
  cors({
    origin: [process.env.LOCALHOST, process.env.WEB_URL],
  })
)
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// ***** port listneer *****
server.listen(PORT, () => {
  return console.log(`Listening to the port ${PORT}`);
});
