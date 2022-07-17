const Pusher = require("pusher");
const { SOCKET_CREDENTAIL } = require("../configs/index.config");

const pusher = new Pusher(SOCKET_CREDENTAIL);