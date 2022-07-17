const schedule = require("node-schedule");

const scheduleInit= (deadline) => {
 schedule.scheduleJob(deadline, () => {
  console.log("hacker")
 });
}

module.exports = scheduleInit;