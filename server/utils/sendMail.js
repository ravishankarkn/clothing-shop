const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host: "smtp-relay.brevo.com",
port: 587,
secure: false,

auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});

const sendMail = async (email, otp) => {
try {


console.log("OTP about to send to:", email);

const info = await transporter.sendMail({
  from: `"Clothing Shop" <${process.env.SMTP_USER}>`,
  to: email,
  subject: "Verify Email",

  html: `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Please use this OTP to continue.</p>
    </div>
  `
});

console.log("Mail sent:", info.messageId);


} catch (err) {
console.log("Mail error:", err.message);
throw err;
}
};

module.exports = sendMail;
