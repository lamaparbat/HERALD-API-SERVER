const routineModel = require("../../../models/routineModel");
const { StatusCodes } = require("http-status-codes");

const UpdateRoutine = (req, res) => {
  //get the routine doc id
  const { routineID, ...updatedRoutine } = req.body;

  // checking if routineID is in req.body
  if (!routineID)
    return res.status(StatusCodes.NOT_ACCEPTABLE).send({
      message: "routine ID is empty",
    });


  routineModel.findByIdAndUpdate(
    routineID,
    {
      ...updatedRoutine,
      updatedOn: new Date().toLocaleDateString(),
    },
    (err, data) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Internal Server Error !!",
        });
        // if routineID is incorrect

      } else if (data === null) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: "Incorrect routineID! ",
        });
      } else {
        return res.status(StatusCodes.OK).send({
          message: "Routine succesfully updated !!",
        });
      }
    }
  );
};

module.exports = UpdateRoutine;
