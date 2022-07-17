require("dotenv").config()
const env = process.env.NODE_ENV || 'development';
const API_URL = "http;//localhost:8000";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routincemanagementsystem";
const PORT = process.env.PORT || 8000;
const DB_URL = "mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority";

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY,  PORT, DB_URL };