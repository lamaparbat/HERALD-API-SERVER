require("dotenv").config();
const PRODUCTION_CONFIG = require("../configs/production.config")
const DEVELOPMENT_CONFIG = require("../configs/development.config")


const config = process.env.NODE_ENV === 'production' ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;

module.export = config;

