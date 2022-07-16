require("dotenv").config()
const { ServerApiVersion } = require('mongodb');


const env = process.env.NODE_ENV || 'development';
const API_URL = "http;//localhost:8000";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routincemanagementsystem";
const PORT = process.env.PORT || 8000;
const DB_URL = "mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority";
const SOCKET_CREDENTAIL = {
 appId: "1419323",
 key: "72d2952dc15a5dc49d46",
 secret: "ac6613086c0a1909c4a3",
 cluster: "ap2",
 useTLS: true
}
const DB_CONFIG = {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 serverApi: ServerApiVersion.v1,
}

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, PORT, DB_URL, SOCKET_CREDENTAIL, DB_CONFIG};