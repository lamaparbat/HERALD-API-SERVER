const schedule = require("node-schedule");

const scheduler = (deadline) => {
 if (true) {
  job.cancel();
 }
 const job = schedule.scheduleJob(deadline, () => {
  console.log("gacjer");
 });
}

module.exports = scheduler;