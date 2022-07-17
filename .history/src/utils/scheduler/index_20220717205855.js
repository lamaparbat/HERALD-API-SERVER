const schedule = require("node-schedule");

const scheduler = (deadline) => {
 const job = schedule.scheduleJob(deadline, () => {
  console.log("deadline reached");
  job.cancel();
 });
}

module.exports = scheduler;