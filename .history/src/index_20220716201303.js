//import packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require("yamljs");
const routes = require("../src/routes/index.routes.js");
const { START_DB_CONNECTION } = require("../src/utils/index.utils");
const config = require("./configs/index.config");

console.log(config)

// **** -> server config <- *******
const server = express();


// start mongodb server connection
START_DB_CONNECTION();

// ***** -> Swagger config <- ******
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
