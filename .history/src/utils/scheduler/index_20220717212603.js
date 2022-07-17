const schedule = require("node-schedule");

const jobScheduler = (deadline) => schedule.scheduleJob(deadline, () => {
 console.log("gacjer");
});

module.exports = jobScheduler;