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

const routineAuth = () => {
    return async (req, res, next) => {
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
        } = req.body;

        // for update routine, validate routineID
        let routineID;
        if (req.method === 'PUT') {
            routineID = req.body.routineID;
            try {
                await routineModel.findOne({ _id: routineID });
            } catch (error) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message: 'Incorrect routineID! ',
                });
            }
        }

        //check if all attributes are recieved or not ?

        // let checkPayload = true;
        const payload = Object.keys(req.body);
        const checkPayload = ROUTINE_PAYLOAD.some(
            (element) => !payload.includes(element)
        );
        if (checkPayload) {
            return res.status(StatusCodes.PARTIAL_CONTENT).send({
                success: false,
                message:
                    'Some fields are missing. Please provide all the fields !!',
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
        // converting given payload to proper format

        let payLoadStartTime = startTime;
        let payLoadEndTime = endTime;
        payLoadEndTime = timeConvertor(payLoadEndTime);
        payLoadStartTime = timeConvertor(payLoadStartTime);

        // check if group array has duplicate groups

        const checkIfDuplicateExists = (arr) =>
            new Set(arr).size !== arr.length;
        if (checkIfDuplicateExists(modifiedGroup))
            return res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Found duplicate group name!',
            });

        const checkIfAvailable = (array, type) => {
            let test = false;
            array.forEach((element) => {
                let startingTime = element.startTime;
                let endingTime = element.endTime;
                startingTime = timeConvertor(startingTime);
                endingTime = timeConvertor(endingTime);
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
        } catch (err) {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }
        //logical validation
        // case 1 : check if classroom is blocked or not

        const check = resultData.filter((element) => {
            return (
                element.blockName === modifiedBlockName &&
                element.roomName === modifiedRoomName &&
                element.day === modifiedDay
            );
        });
        // if end time is less than start time

        try {
            if (payLoadEndTime <= payLoadStartTime) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'end time should be greater than start time',
                });
            }
            if (
                checkIfAvailable(check, 'room') === CHECK_IF_AVAILABLE['room']
            ) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message:
                        'The room for this particular time is already reserved for another class',
                });
            }
        } catch (err) {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }

        // case 2 : check if teacher is already assigned in another class at give time

        try {
            const teacherData = resultData.filter((element) => {
                return (
                    element.teacherName === modifiedTeacherName &&
                    element.day === modifiedDay
                );
            });
            if (
                checkIfAvailable(teacherData, 'teacher') ===
                CHECK_IF_AVAILABLE['teacher']
            ) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message:
                        'The teacher is already reserved for another class in this time',
                });
            }
        } catch (err) {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }

        // case 3: one group cannot have diferent classes on same time range

        try {
            const classData = resultData.filter((element) => {
                return (
                    element.day === modifiedDay &&
                    element.group.some((data) => modifiedGroup.includes(data))
                );
            });
            if (
                checkIfAvailable(classData, 'group') ===
                CHECK_IF_AVAILABLE['group']
            ) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'This group has another class in this time',
                });
            }
        } catch (err) {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }

        // case 4: One group cannot have multiple class of same module in a single day

        try {
            const dayData = resultData.filter((element) => {
                return (
                    element.group.some((data) =>
                        modifiedGroup.includes(data)
                    ) && element.moduleName === modifiedModuleName
                );
            });
            let check = false;
            dayData.forEach((element) => {
                if (modifiedModuleName === element.moduleName) check = true;
            });
            if (check) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    success: false,
                    message: 'The given group has already taken this class',
                });
            }
        } catch (err) {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).send(err);
        }
        next();
    };
};

module.exports = routineAuth;
