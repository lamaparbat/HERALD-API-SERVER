const routineModel = require('../../../models/routineModel')

const { StatusCodes } = require("http-status-codes");

const getOngoingRoutine = async (req, res, next) => {
    const { group } = req.query
    const grp = Array.isArray(group) ? group : [group]
    try {
        if (group) {
            const ongoingGroup = await routineModel.find({ groups: { $in: grp }, status: { $eq: 'ONGOING' } })
            if (ongoingGroup.length) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    'ongoingClassGroup/s': ongoingGroup
                })
            }
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'this group has no ongoing classes'
            })
        }

        const ongoingGroups = await routineModel.find({ status: { $eq: 'ONGOING' } })
        return res.status(StatusCodes.OK).json({
            success: true,
            ongoingGroups
        })
    } catch (err) {
        next(err)
    }


}

module.exports = getOngoingRoutine;