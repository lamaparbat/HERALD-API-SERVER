const xlsx2json = require('xlsx2json');
const { StatusCodes } = require("http-status-codes");


const UPLOAD_STUDENT_LIST =  async (req, res) => {
 try {
  xlsx2json(`collegeData/${uploadFileName}`).then(jsonArray => {
   jsonArray.map(async (array) => {
    await array.map(async (data) => {
     if (data["A"] !== "S.N.") {
      const email = data["B"] + "@HERALDCOLLEGE.EDU.NP";
      const group = data["D"];
      //check if data already exists in db
      const searchResult = await studentModel.find({ uid: email });
      if (searchResult[0] === undefined) {
       //inserting into db
       const response = new studentModel({
        uid: data["B"] + "@HERALDCOLLEGE.EDU.NP",
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
   fs.unlinkSync(`collegeData/${uploadFileName}`);

   res.status(StatusCodes.OK).send("Data extracted and import to DB successfully.")
  });
 } catch (error) {
  //delete the file
  fs.unlinkSync(`collegeData/${uploadFileName}`);
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
 UPLOAD_ADMIN_LIST
}