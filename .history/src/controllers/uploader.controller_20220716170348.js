const xlsx2json = require('xlsx2json');


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
        res.status(500).send("SERVER ERORR !!");
       }
      }
     }
    });
   });

   //delete the file
   fs.unlinkSync(`collegeData/${uploadFileName}`);

   res.status(200).send("Data extracted and import to DB successfully.")
  });
 } catch (error) {
  //delete the file
  fs.unlinkSync(`collegeData/${uploadFileName}`);
  res.status(500).send("Failed to parse the given file. Please upload the xlsx formate file only !!")
 }
}



module.exports  ={ UPLOAD_STUDENT_LIST}