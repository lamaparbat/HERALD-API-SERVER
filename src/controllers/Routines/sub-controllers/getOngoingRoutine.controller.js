const routineModel = require('../../../models/routineModel')

const { StatusCodes } = require("http-status-codes");

const getOngoingRoutine = async (req, res, _next) => {
    const { group } = req.query
    const grp = Array.isArray(group) ? group : [group]

    if (group) {
        const ongoingGroup = await routineModel.find({ group: { $in: grp }, status: { $eq: 'ONGOING' } })
        if (ongoingGroup) {
            return res.status(StatusCodes.OK).json({
                success: true,
                ongoingGroup
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'this group has no ongoing classes'
            })
        }
    }

    const ongoingGroups = await routineModel.find({ status: { $eq: 'ONGOING' } })
    return res.status(StatusCodes.OK).json({
        success: true,
        ongoingGroups
    })
}

module.exports = getOngoingRoutine;