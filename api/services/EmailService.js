// const nodemailer = require('nodemailer');
// const { email } = require('../config');

// const transporter = nodemailer.createTransport({
//   service: email.service,
//   auth: {
//     user: email.auth.user,
//     pass: email.auth.pass
//   }
// });

// module.exports = {
//   sendEmail: async function(to, subject, text, html) {
//     const mailOptions = {
//       from: email.from,
//       to: to,
//       subject: subject,
//       text: text,
//       html: html
//     };
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log("Message sent: %s", info.messageId);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };
