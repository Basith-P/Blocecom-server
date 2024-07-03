import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, message) => {
  // const transporter = createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // const mailOptions = {
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: subject,
  //   text: message,
  // };

  // return transporter.sendMail(mailOptions, (err, info) => {
  //   if (err) {
  //     console.log("Error sending email: ", err);
  //     return false;
  //   }
  //   console.log("Email sent: " + info.response);
  //   return true;
  // });

  return new Promise((resolve, reject) => {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error sending email: ", err);
        reject(false);
      }
      console.log("Email sent: " + info.response);
      resolve(true);
    });
  });
};
