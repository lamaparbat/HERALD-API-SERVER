const schedule = require("node-schedule");

const jobScheduler = (deadline, kind) => {
 const job = schedule.scheduleJob(deadline, () => {
  console.log("gacjer ",kind );
  // job.cancel();
 })
};



module.exports = jobScheduler;