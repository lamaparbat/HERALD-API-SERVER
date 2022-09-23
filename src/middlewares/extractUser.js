const { userAttemptCounts } = require('../constants/userLogin.constant');

/**
 * middleware to check if email is already in the array of userAttemptCounts or not
 * if it already exists we send that user to the next controller
 * if not then we create a user append it to the userAttemptCounts array & send it to the controller
 */
const extractUser = (req, res, next) => {
    const { email } = req.body;
    // checking if user already exists in the array
    const userFound = userAttemptCounts.find((user) => user.email === email);
    // if user exists we send that use to next controller
    if (userFound) {
        req.user = userFound;
        next()
    // else if it doesn't exists we create it, append to the array and send it
    } else {
        const userToAdd = { email, attempts: 0 };
        userAttemptCounts.push(userToAdd);
        req.user = userToAdd;
        next();
    }
};


module.exports = extractUser
