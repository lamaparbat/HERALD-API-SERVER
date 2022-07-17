const schedule = require("node-schedule");

const scheduler = (deadline) => {
 const job = schedule.scheduleJob(deadline, () => {
  console.log("gacjer");
 });
 if (true) {
  job.cancel();
 }
}

module.exports = scheduler;