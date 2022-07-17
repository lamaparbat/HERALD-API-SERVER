const schedule = require("node-schedule");

const scheduleInit= (deadline) => {
 schedule.scheduleJob(deadline, () => {
  console.log("deadline reached");
 });
}

module.exports = scheduleInit;