/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    //secure: process.env.EMAIL_SSL, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define the email options
  const mailOptions = {
    // from: process.env.EMAIL_FROM,
    from: 'Dan Toledano <dan@dan.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  //3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
