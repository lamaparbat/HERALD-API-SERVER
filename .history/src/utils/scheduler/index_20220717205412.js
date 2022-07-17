const schedule = require("node-schedule");

const scheduleInit= (deadline) => {
 return schedule.scheduleJob(deadline, () => {
  return "hacker"
 });
}

module.exports = scheduleInit;