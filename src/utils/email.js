import nodemailer from "nodemailer";
import { env } from "../../config/serverConfig.js";
export const sendEmail = async (options) => {
  // 1) create a transporter
  // Looking to send emails in production? Check out our Email API/SMTP product!
  var transport = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options

  const mailOptions = {
    from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    html: options.html, // html body
  };

  // 3) actuall send the email
  const response = await transport.sendMail(mailOptions);
  // 4) log the response
  if (response.accepted.length > 0) {
    console.log("Email sent successfully:", response);
  } else {
    console.error("Failed to send email:", response);
  }
};

export { sendEmail as default };
