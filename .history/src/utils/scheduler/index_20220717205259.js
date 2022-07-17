const schedule = require("node-schedule");

const scheduleInit= (deadline) => {
 schedule.scheduleJob(deadline, () => {
  return "hacker"
 });
}

console.log(scheduleInit("* * * * * *"))

module.exports = scheduleInit;