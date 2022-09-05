const schedule = require("node-schedule");

const jobScheduler = (deadline, kind) => {
 const job = schedule.scheduleJob(deadline, () => {
  // job.cancel();
 })
};



module.exports = jobScheduler;