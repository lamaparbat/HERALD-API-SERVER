require("dotenv").config()
const env = process.env.NODE_ENV || 'production';
const API_URL = "";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routinemanagementsystem";
const PORT = process.env.PORT || 8888;

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY,PORT };