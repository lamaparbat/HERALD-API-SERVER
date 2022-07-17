const schedule = require("node-schedule");

const jobScheduler = schedule.scheduleJob(deadline, () => {
 console.log("gacjer");
});

module.exports = jobScheduler;