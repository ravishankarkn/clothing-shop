const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
service: "gmail",
host: "smtp.gmail.com",
port: 465,
secure: true,

auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
},

family: 4
});

transporter.verify((err) => {
if (err) {
console.log("SMTP verify error:", err);
} else {
console.log("SMTP Ready ✅");
}
});

const sendMail = async (email, otp) => {
try {
console.log("OTP about to send to:", email);

const info = await transporter.sendMail({
  from: `"Clothing Shop" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Verify Email",
  html: `<h2>Your OTP: ${otp}</h2>`
});

console.log("Mail sent:", info.messageId);


} catch (err) {
console.error("Mail error:", err);
throw err;
}
};

module.exports = sendMail;
