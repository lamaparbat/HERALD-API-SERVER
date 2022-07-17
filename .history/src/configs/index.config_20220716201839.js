require("dotenv").config();
const PRODUCTION_CONFIG = require("../configs/production.config");
const DEVELOPMENT_CONFIG = require("../configs/development.config");


console.log(typeof PRODUCTION_CONFIG)

const config = process.env.NODE_ENV === 'production' ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;

module.exports = config;

