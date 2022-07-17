const schedule = require("node-schedule");

const scheduleInit= (deadline) => {
 schedule.scheduleJob(deadline, () => {
  return "hacker"
 });
}

module.exports = scheduleInit;