const mongoose = require('mongoose');
const {DB_URL,DB_CONFIG} = require("../configs/index.config");

const START_DB_CONNECTION = () => {
  mongoose.connect(DB_URL, DB_CONFIG ).then(() => {
  console.log('Mongodb connection succesfull !!')
 })
  .catch((err) => {
   console.log(err)
  });
}

module.exports = START_DB_CONNECTION;