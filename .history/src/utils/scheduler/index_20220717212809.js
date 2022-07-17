const schedule = require("node-schedule");

const jobScheduler = (deadline) => {
 const job = schedule.scheduleJob(deadline, () => {
  console.log("gacjer");
  job.cancel();
 })
};



module.exports = jobScheduler;