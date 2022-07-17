const Pusher = require("pusher");
const config = require("../configs/socket.config");

const pusher = new Pusher(config);