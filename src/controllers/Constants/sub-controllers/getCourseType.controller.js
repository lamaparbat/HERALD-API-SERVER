const {COMMON_CONSTANT} = require('../../../constants/index')
const { StatusCodes } = require("http-status-codes");

const GetCourseType = (req,res,next) =>{
    try {
        const {COURSE_TYPE} = COMMON_CONSTANT;
        return res.status(StatusCodes.OK).send({
        success: true,
        courseTypes: COURSE_TYPE
    });
    } catch (error) {
        next(error)
    }
    
}

module.exports = GetCourseType;