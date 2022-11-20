const {ROUTINE_CONSTANT} = require('../../../constants/index')
const { StatusCodes } = require("http-status-codes");

const GetStatus = (req,res,next) =>{
    try {    
        const {ROUTINE_STATUS} = ROUTINE_CONSTANT;
        return res.status(StatusCodes.OK).send({
            success: true,
            statusList: ROUTINE_STATUS
        });
    }
    catch (error) {
        next(error)
    }
}

module.exports = GetStatus;