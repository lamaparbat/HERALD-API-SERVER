const lostFoundModel = require('../../../models/lostFoundModel');
const { StatusCodes } = require("http-status-codes");

const ReportLostFoundData = (req, res) => {
 const { items, desc, lostDate } = req.body;
 
 // validation
 if (Object.keys(req.body).length === 3) {
  if (items.length && desc.length > 3 && lostDate.length > 3  ) {
   //db insertion
   const data = new lostFoundModel({
    items, 
    desc,
    lostDate,
    isVictimRecievedData: false,
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString(),
   });

   //save the data
   data.save().then(() => {
    res.status(StatusCodes.OK).send({
     message: "Report posted successfully !!"
    });
   }).catch(err => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
     message: "500 BACKEND SERVER ERROR !!"
    });
   });
  } else {
   res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
    message: "Validaton issues."
   });
  }
 } else {
  res.status(StatusCodes.NOT_FOUND).send({
   message: "Some fields are missing."
  });
 }

}


module.exports = ReportLostFoundData;
