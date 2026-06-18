const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host: "smtp-relay.brevo.com",
port: 587,
secure: false,

auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
},

connectionTimeout: 30000,
greetingTimeout: 30000
});

// Verify SMTP once on startup
transporter.verify((err, success) => {
if (err) {
console.log("SMTP verify error:", err.message);
} else {
console.log("SMTP Ready ✅");
}
});

const sendMail = async (email, otp) => {
try {
console.log("OTP about to send to:", email);


const info = await transporter.sendMail({
  from: `"Clothing Shop" <${process.env.SMTP_USER}>`,
  to: email,
  subject: "Verify Email",

  html: 
    <div style="font-family:Arial;padding:20px">
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires soon.</p>
    </div>
  
});

console.log("Mail sent:", info.messageId);

return true;


} catch (err) {
console.error("Mail error:", err.message);
throw err;
}
};

module.exports = sendMail;
