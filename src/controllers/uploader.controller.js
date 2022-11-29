const xlsx2json = require('xlsx2json');
const xlsx = require('xlsx');
const fs = require('fs');
const { StatusCodes } = require("http-status-codes");
const studentModel = require("../models/studentModel");
const days = require('../constants/routine.constant').VALID_DAYS;
const { routineValidation } = require('../middlewares/routineAuth');
const routineModel = require('../models/routineModel');

const timeParser = (time) => {
    const [startTime, endTime] = time.split('-');
    return { startTime, endTime };
}

const dayParser = (day) => {
    const dayFound = days.find(d => d.toUpperCase().includes(day));
    return dayFound;
}

const groupParser = (group) => {
    const [prefix, suffix] = group.split('(')
    return suffix.slice(0, -1).split('+').map(char => prefix + char)
}

const UPLOAD_SCHEDULE = async (req, res) => {
    //if file with non '.xlsx' extention is received: req.files = empty object
    if (!Object.keys(req.files).length) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: 'invalid file format'
        })
    }
    //isolation the excel file from schedule field
    const { schedule: [file] } = req.files;
    //reading the excel file
    const xlxsFile = xlsx.readFile(file.path)
    const excelSheetToRead = xlxsFile.Sheets[xlxsFile.SheetNames];
    //parsing the excel file to json
    const fileData = xlsx.utils.sheet_to_json(excelSheetToRead)
    const createdOn = new Date().toLocaleDateString();

    //this array will contain all the routine that conflict with the current routines
    const conflictingRoutines = [];
    //get all routine data
    const routineData = await routineModel.find();
    
    //extracting the data and assigning valid names
    fileData.forEach(async ({ Day, Time, Group: groups, Block: blockName, Lecturer: teacherName, Room: roomName,
        'Module Code': modeulCode, 'Module Title': moduleName, 'Class Type': classType }) => {
        classType === 'Lecture' ? groups = groupParser(groups) : groups = [groups]
        const obj = {
            courseType: 'BIT',
            moduleName: moduleName.toUpperCase(),
            teacherName: teacherName.toUpperCase(),
            classType: classType.toUpperCase(),
            groups,
            roomName: roomName.toUpperCase(),
            blockName: blockName.toUpperCase(),
            day: dayParser(Day),
            ...timeParser(Time),
            createdOn,
        }

        // validating the routine data if it returns an error we add that object to the conflictingRoutines array
        // else we save the object to the database
        try {   
            routineValidation(obj, routineData)
            await new routineModel(obj).save();
        } catch (err) {
            conflictingRoutines.push(obj)
        }
    })

    //error case
    if (conflictingRoutines.length) {
        return res.status(StatusCodes.PARTIAL_CONTENT).json({
            success: false,
            message: 'some routine were conflication with pre existing routines',
            conflictingRoutines
        })
    }

    //success case
    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'file upload was successful!'
    })
}

const UPLOAD_STUDENT_LIST = async (req, res) => {
 let uploadFileName = req.body.uploadFileName;
 try {
  xlsx2json(`${__dirname}/../../uploads/${uploadFileName}`).then(jsonArray => {
   jsonArray.map(async (array) => {
    await array.map(async (data) => {
     if (data["A"] !== "S.N.") {
      const email = data["B"]?.toUpperCase() + "@HERALDCOLLEGE.EDU.NP";
      const name = data["C"]?.toUpperCase();
      const group = data["D"]?.toUpperCase();
      //check if data already exists in db
      const searchResult = await studentModel.find({ uid: email });
      if (searchResult[0] === undefined) {
       //inserting into db
       const response = new studentModel({
        uid: data["B"] + "@HERALDCOLLEGE.EDU.NP",
        name: name,
        group: group
       });

       try {
        const result = await response.save();
       } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("SERVER ERORR !!");
       }
      }
     }
    });
   });

   //delete the file
   fs.unlinkSync(`${__dirname}/../../uploads/${uploadFileName}`);

   res.status(StatusCodes.OK).send("Data extracted and import to DB successfully.")
  });
 } catch (error) {
  //delete the file
  fs.unlinkSync(`${process.cwd()}/uploads/${uploadFileName}`);
  res.status(StatusCodes.NOT_ACCEPTABLE).send("Failed to parse the given file. Please upload the xlsx formate file only !!")
 }
}

const UPLOAD_TEACHER_LIST = (req, res) => {
    res.send("in progress")
}

const UPLOAD_ADMIN_LIST = (req, res) => {
    res.send("in progress")
}


module.exports = {
    UPLOAD_STUDENT_LIST,
    UPLOAD_TEACHER_LIST,
    UPLOAD_ADMIN_LIST,
    UPLOAD_SCHEDULE
}