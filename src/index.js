//import packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const YAML = require("yamljs");
const routes = require("../src/routes/index.routes.js");
const { START_DB_CONNECTION } = require("../src/utils/index.utils");
const { PORT } = require("./configs/index.config");
const routineModel = require("./models/routineModel");
const path = require("path");
const errorHandler = require('./middlewares/errorHandler')
// **** -> server config <- *******
const server = express();


// start mongodb server connection
START_DB_CONNECTION();

// ***** -> Swagger config <- ******
const swaggerDocs = YAML.load("./api.yaml");

//middleware
server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname , "/public")))
server.use('/api/v4',routes);
server.use(
  cors({
    origin: [process.env.LOCALHOST, process.env.WEB_URL],
  })
)
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// listen the changes in db 
// routineModel.watch().on("change", (data) => {
//   console.log("DB updated: ", data);
// })

server.use(errorHandler)

// ***** port listneer *****
server.listen(PORT, () => {
  return console.log(`Listening to the port ${PORT}`);
});
