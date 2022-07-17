require("dotenv").config()
const env = process.env.NODE_ENV || 'production';
const API_URL = "";
const ACCESS_TOKEN_KEY = "routinemanagementsystem123";
const REFRESH_TOKEN_KEY = "routinemanagementsystem";
const PORT = process.env.PORT || 8888;
const DB_URL = "mongodb+srv://cms_herald:hacker123@cluster0.csdtn.mongodb.net/rms?retryWrites=true&w=majority";
const SOCKET_CREDENTAIL = {
 appId: "1419323",
 key: "72d2952dc15a5dc49d46",
 secret: "ac6613086c0a1909c4a3",
 cluster: "ap2",
 useTLS: true
}

module.exports = { env, API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, PORT, DB_URL, SOCKET_CREDENTAIL };