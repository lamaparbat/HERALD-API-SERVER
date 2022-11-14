
const studentModel = require('../../../models/studentModel');
const { StatusCodes } = require("http-status-codes");

const GET_STUDENT_LIST = async (req, res) => {

   

    try {
       const data = await studentModel.find();

       // filter students

       const field = req.query;
       let newData;
       // create new formatted studentlist to search dynamically

       const filterFormattedData = [];
       data.forEach(element => {
         filterFormattedData.push({
            _id: element._id,
            uid: element.uid,
            name: element.name,
            group: element.group.substring(4),
            level: element.group[1]
         })
       });

       if(field.length != 0){

         newData = filterFormattedData.filter((item) => {
            const keys = Object.keys(field);
            found = false;
            keys.forEach(key => {
               if (item[key] === undefined || item[key] != field[key])found = true;
             })
            if(found) return false;
            else return true; 
         });
         return res.status(StatusCodes.OK).send(newData);
      }         
       res.status(StatusCodes.OK).send(data)
    } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
 }

module.exports = GET_STUDENT_LIST