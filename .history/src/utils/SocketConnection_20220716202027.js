const Pusher = require("pusher");
const { SOCKET_INFO } = require("../configs/index.config");

const pusher = new Pusher(config);