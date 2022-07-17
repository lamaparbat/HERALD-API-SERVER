const schedule = require("node-schedule");

const scheduler = (deadline) => {
 schedule.scheduleJob(deadline, () => {
  console.log("deadline reached");
  schedule.cancelJob();
 });
}

module.exports = scheduler;