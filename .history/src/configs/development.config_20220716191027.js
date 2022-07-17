require("dotenv").config()
const env = process.env.NODE_ENV || 'development';
const API_URL = "http;//localhost:8000";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routinemanagementsystem";

console.log(process.env.NODE_ENV)

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };