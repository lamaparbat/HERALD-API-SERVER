const studentModel = require('../../models/studentModel');
const auth = require('../../middlewares/auth');
const { StatusCodes } = require("http-status-codes");

// flag
var studentAttemptCount = 0, blockEmail;

const LOGIN = async (req, res) => {
   // destructuring the incoming data
   var { uid } = req.body;
   uid = uid.toUpperCase();

   //uid validation
   if (typeof uid !== "string") {
      return res.status(StatusCodes.PARTIAL_CONTENT).send("Please enter email in string format.")
   }

   // excess attempt check
   if (studentAttemptCount <= 5 && blockEmail !== uid) {
      //verify the uid
      if ((uid.includes('NP') && uid.includes('HERALDCOLLEGE.EDU.NP')) === false) {
         return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unverified users.',
            token: null,
         });
      }


      // ***** database data mapping *****
      try {
         const data = await studentModel.find({ uid: uid })

         if (data.length !== 0) {
            //reset the attempt account details
            studentAttemptCount = 0;
            blockEmail = null;

            //generate the token
            const { accessToken, refreshToken } = auth.GenerateJWT(uid);
            return res.status(StatusCodes.OK).send({
               message: 'Login succesfull !!',
               email: data[0].uid,
               group: data[0].group,
               scope:"student",
               accessToken: accessToken,
               refreshToken: refreshToken
            });
         } else {
            //increase the wrong email counter by 1
            studentAttemptCount++;
            //if email counter reach 5, then store the cache
            if (studentAttemptCount === 5) {
               setTimeout(() => {
                  //reset the attemptCount after 5 minutes
                  attemptCount = 0;
                  blockEmail = null;

                  console.log('Now you can login. => ' + studentAttemptCount);
               }, 300000);
            }

            return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send({
               message: 'Failed to login. Please use correct email !!',
               token: null,
            })
         }
      } catch (error) {
         console.log(error)
         //if issue found on server, return message
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: error,
            token: null,
         })
      }
   } else {
      blockEmail = uid;
      studentAttemptCount = 0;
      return res.status(StatusCodes.FORBIDDEN).send({
         message: 'You exceed the 5 login attempt. Please try again after 5 min !!',
      })
   }
}


const GET_STUDENT_LIST = async (req, res) => {
   try {
      const data = await studentModel.find();

      res.status(StatusCodes.OK).send(data)
   } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
   }
}
module.exports = { LOGIN, GET_STUDENT_LIST };