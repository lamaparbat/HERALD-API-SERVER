const {COMMON_CONSTANT} = require('../../../constants/index')
const { StatusCodes } = require("http-status-codes");

const GetClassType = (req,res,next) =>{
    try {
        const {CLASS_TYPE} = COMMON_CONSTANT;
        return res.status(StatusCodes.OK).send({
            success: true,
            classTypes: CLASS_TYPE
        });
    } catch (error) {
        next(error)
    }
}

module.exports = GetClassType;