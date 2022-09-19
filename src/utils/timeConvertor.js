const timeConvertor = (time) => {
  let startingTime = time.slice(0, -2);
  let modifiedStartingTime = 0;
  startingTime = time.split(":");
  modifiedStartingTime = parseInt(startingTime[0] + startingTime[1]);
  return modifiedStartingTime;
};

module.exports = timeConvertor;
