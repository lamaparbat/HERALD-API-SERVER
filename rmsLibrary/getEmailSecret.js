require("dotenv").config();
const nodeMailer = require("nodemailer");

async function main() {
 let transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASSWORD
  }
 });
 
 let mailOptions = {
  from: '"Parbat Lama" <parbatlama70@gmail.com>', // sender address
  to: "lamaparbat70@gmail.com", // list of receivers
  subject: "Testing email", // Subject line
  text: "Hi dear !!", // plain text body
  html: '<b>NodeJS Email Tutorial</b>' // html body
 };

 transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
   return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
  res.render('index');
 });
}

main().catch(console.error);