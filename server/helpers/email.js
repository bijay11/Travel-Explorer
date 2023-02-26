const nodemailer = require('nodemailer');

const { EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } = process.env;

const sendEmail = async (options) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  // Define email options
  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
