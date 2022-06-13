const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
 service: "gmail",
 auth: {
  user: "lamaparbat70@gmail.com",
  pass: "banehjhgafuklpns"
 }
});

var mailOption = {
 from: "lamaparbat70@gmail.com",
 to: "parbatlama70@gmail.com",
 subject: 'Sending Email using Node.js',
 text: 'That was easy!'
}

transporter.sendMail(mailOption, (error, info) => {
 if (error) {
  console.log(error);
 } else {
  console.log('Email sent: ' + info.response);
 }
})