//import packages
const express = require("express");

//creating express object
const server = express()

//default routing
server.get("/", (req, res) => {
 res.send("Server started on default routes.....")
})

//listen port
server.listen(8080, () => {
 console.log("server connected......");
})

