const schedule = require("node-schedule");

const scheduleInit= (deadline) => {
 schedule.scheduleJob(deadline, () => {
  return "hacker"
 });
}

console.log(scheduleCron("* * * * * *"))

module.exports = scheduleInit;