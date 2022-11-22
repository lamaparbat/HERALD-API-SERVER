const timeConvertor = require('../utils/timeConvertor');
const { StatusCodes } = require('http-status-codes');
const routineModel = require('../models/routineModel');

const {
    ROOMS,
    ROUTINE_PAYLOAD,
    ROUTINE_STATUS,
    CHECK_IF_AVAILABLE,
    VALID_DAYS,
} = require('../constants/index').ROUTINE_CONSTANT;
const { CLASS_TYPE, COURSE_TYPE } =
    require('../constants/index').COMMON_CONSTANT;

const routineValidation = ({ blockName, roomName, day, moduleName, teacherName, group, startTime, endTime }, resultData = []) => {

    // converting given payload to proper format
    let payLoadStartTime = timeConvertor(startTime);
    let payLoadEndTime = timeConvertor(endTime);

    //check if given room/teacher/group is available at that time
    const checkIfAvailable = (array, type) => {
        let test = false;
        array.forEach((element) => {
            let startingTime = timeConvertor(element.startTime);
            let endingTime = timeConvertor(element.endTime);
            if (
                (payLoadStartTime < endingTime &&
                    payLoadStartTime >= startingTime) ||
                (payLoadEndTime <= endingTime &&
                    payLoadEndTime > startingTime) ||
                (payLoadStartTime <= startingTime &&
                    payLoadEndTime >= endingTime)
            ) {
                test = true;
            }
        });
        if (test && type === CHECK_IF_AVAILABLE['room']) return type;
        else if (test && type === CHECK_IF_AVAILABLE['teacher'])
            return type;
        else if (test && type === CHECK_IF_AVAILABLE['group']) return type;
        else return '';
    };

    //logical validation
    // case 1 : check if classroom is blocked or not
    const checkRoom = resultData.filter((element) => {
        return (
            element.blockName === blockName &&
            element.roomName === roomName &&
            element.day === day
        );
    });

    // if end time is less than start time
    if (payLoadEndTime <= payLoadStartTime) {
        throw new Error('end time should be grater than start time')
    }

    if (
        checkIfAvailable(checkRoom, 'room') === CHECK_IF_AVAILABLE['room']
    ) {
        throw new Error('The room for this particular time is already reserved for another class')
    }

    // case 2 : check if teacher is already assigned in another class at give time
    const teacherData = resultData.filter((element) => {
        return (
            element.teacherName === teacherName &&
            element.day === day
        );
    });

    if (
        checkIfAvailable(teacherData, 'teacher') ===
        CHECK_IF_AVAILABLE['teacher']
    ) {
        throw new Error('The teacher is already reserved for another class in this time')
    }

    // case 3: one group cannot have diferent classes on same time range
    const classData = resultData.filter((element) => {
        return (
            element.day === day &&
            element.group.some((data) => group.includes(data))
        );
    });

    if (
        checkIfAvailable(classData, 'group') ===
        CHECK_IF_AVAILABLE['group']
    ) {
        throw new Error('This group has another class in this time')
    }

    // case 4: One group cannot have multiple class of same module in a single day
    const dayData = resultData.filter((element) => {
        return (
            element.group.some((data) =>
                group.includes(data)
            ) && element.moduleName === moduleName
        );
    });

    let check = false;
    dayData.forEach((element) => {
        if (moduleName === element.moduleName) check = true;
    });

    if (check) {
        throw new Error('The given group has already taken this class')
    }
};

const routineAuth = () => {
    return async (req, res, next) => {
        const body = req.body;
        const {
            courseType,
            moduleName,
            teacherName,
            classType,
            group,
            roomName,
            blockName,
            day,
            startTime,
            endTime,
            status,
        } = body;

        // for update routine, validate routineID
        let routineID;
        if (req.method === 'PUT') {
            routineID = req.params.routineId;
            try {
                const routineData = await routineModel.findById(routineID);
                if (!routineData) throw new Error("Invalid routine id.")
            } catch (error) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message: "Invalid routine id.",
                });
            }
        }

        //check if all attributes are recieved or not ?
        const missingFields = ROUTINE_PAYLOAD.filter(field => !Object.keys(body).includes(field))

        if (missingFields.length) {
            return res.status(StatusCodes.PARTIAL_CONTENT).send({
                success: false,
                message:
                    'Some fields are missing. Please provide all the fields !!',
                missingFields
            });
        }

        // making payload upper case
        let modifiedBlockName = blockName.toUpperCase();
        let modifiedRoomName = roomName.toUpperCase();
        let modifiedDay = day.toUpperCase();
        let modifiedModuleName = moduleName.toUpperCase();
        let modifiedClassType = classType.toUpperCase();
        let modifiedGroup = [];
        if (Array.isArray(group))
            modifiedGroup = group.map((element) => element.toUpperCase());
        else modifiedGroup.push(group.toUpperCase());
        let modifiedTeacherName = teacherName.toUpperCase();
        let modifiedStatus = status.toUpperCase();
        let modifiedCourseType = courseType.toUpperCase();

        // validate groupName format
        const groupNameFormat = new RegExp(/L[4-9][CB]G\d+/);
        const invalidGroup = modifiedGroup.some(
            (group) => !groupNameFormat.test(group)
        );
        if (invalidGroup) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid group name format! ',
            });
        }

        // validate routine status
        if (!ROUTINE_STATUS.includes(modifiedStatus)) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid routine status !!',
            });
        }

        // validate course type
        if (!COURSE_TYPE.includes(modifiedCourseType)) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid course type !!',
            });
        }

        // validate classType
        if (!CLASS_TYPE.includes(modifiedClassType)) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid class type!',
            });
        }

        // validate roomName and blockName
        const block = ROOMS[modifiedBlockName];

        if (block) {
            if (!block.includes(modifiedRoomName)) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'Invalid Room Name!',
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid Block Name!',
            });
        }

        //day validation
        if (!VALID_DAYS.includes(modifiedDay)) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid Day Name!',
            });
        }
        // validate time format
        var regex = new RegExp(
            /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
        );
        if (!(regex.test(startTime) && regex.test(endTime))) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message:
                    'Invalid time format! Please provide time in 24 hour format',
            });
        }

        // check if group array has duplicate groups
        if (new Set(modifiedGroup).size !== modifiedGroup.length)
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Found duplicate group name!',
            });

        // getting all data from db
        let resultData;
        try {
            // if method is POST, get all data
            // if method is PUT, get all data excluding routine which needs to be updated
            if (req.method === 'POST') resultData = await routineModel.find();
            else if (req.method === 'PUT') {
                resultData = await routineModel.find({
                    _id: { $ne: routineID },
                });
            }

            //validate the routine if error we catch it and throw the error else continue with the next controller
            routineValidation({
                block: modifiedBlockName, room: modifiedRoomName, day: modifiedDay, moduleName: modifiedModuleName,
                teacher: modifiedTeacherName, group: modifiedGroup, startTime, endTime
            }, resultData)

            //catch error and send corresponding error message
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error.message
            })
        }
        //for passing body object to main controller
        req.body = {
            courseType: modifiedCourseType,
            moduleName: modifiedModuleName,
            teacherName: modifiedTeacherName,
            classType: modifiedClassType,
            group: modifiedGroup,
            roomName: modifiedRoomName,
            blockName: modifiedBlockName,
            day: modifiedDay,
            startTime,
            endTime,
            status: modifiedStatus,
            routineID,
        }

        next();
    };
};

module.exports = { routineAuth, routineValidation };
