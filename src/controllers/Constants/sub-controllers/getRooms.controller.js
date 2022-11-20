const {ROUTINE_CONSTANT} = require('../../../constants/index')
const { StatusCodes } = require("http-status-codes");

const GetRooms = (req,res,next) =>{
    try {
        const {ROOMS} = ROUTINE_CONSTANT;
        return res.status(StatusCodes.OK).send({
        success: true,
        Rooms: ROOMS
    });
    } catch (error) {
        next(error)
    }
}

module.exports = GetRooms;