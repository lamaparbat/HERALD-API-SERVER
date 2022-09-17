const timeConvertor = (time) => {
    let startingTime = time.slice(0, -2)
    let modifiedStartingTime = 0
    // for AM format
    if (
      time.charAt(time.length - 2) === 'A' ||
      time.charAt(time.length - 2) === 'a'
    ) {
      startingTime = time.split(':')
      modifiedStartingTime = parseInt(startingTime[0] + startingTime[1])
    }
    // for PM format
    else {
      startingTime = time.split(':')
      if (startingTime[0] === '12')
        modifiedStartingTime = parseInt(startingTime[0] + startingTime[1])
      else
        modifiedStartingTime = parseInt(
          parseInt(startingTime[0]) + 12 + startingTime[1],
        )
    }
    return modifiedStartingTime
  }

module.exports = timeConvertor;