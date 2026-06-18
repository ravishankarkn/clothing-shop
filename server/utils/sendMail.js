const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host: "smtp-relay.brevo.com",
port: 465,
secure: true,

auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
},

connectionTimeout: 10000,
greetingTimeout: 10000,
socketTimeout: 10000
});

const sendMail = async (email, otp) => {
try {


console.log("OTP about to send to:", email);

const info = await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "Verify Email",

  html: `
    <h2>Email Verification</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
  `
});

console.log("Mail sent:", info.messageId);


} catch (err) {
console.error("Mail error:", err);
throw err;
}
};

module.exports = sendMail;
