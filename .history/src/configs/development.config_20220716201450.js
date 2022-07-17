require("dotenv").config()
const env = process.env.NODE_ENV || 'development';
const API_URL = "http;//localhost:8000";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routinemanagementsystem";
const PORT = process.env.PORT || 8000;

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY,  PORT };