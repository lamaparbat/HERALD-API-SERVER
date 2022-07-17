const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const {DB_URL} = require("../configs/index.config");

const START_DB_CONNECTION = () => {
  console.log(DB_URL)
 mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
 }).then(() => {
  console.log('Mongodb connection succesfull !!')
 })
  .catch((err) => {
   console.log(err)
  });
}

module.exports = START_DB_CONNECTION;