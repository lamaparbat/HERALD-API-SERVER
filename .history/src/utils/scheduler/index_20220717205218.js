const schedule = require("node-schedule");

const scheduleCron = (deadline) => {
 schedule.scheduleJob(deadline, () => {
  return "hacker"
 });
}

console.log(scheduleCron("* * * * * *"))

module.exports = schedule;