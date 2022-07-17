require("dotenv").config()
const env = process.env.NODE_ENV || 'production';
const API_URL = "";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routinemanagementsystem";

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };