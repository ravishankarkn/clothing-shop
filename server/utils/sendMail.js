const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Email",
      html: `<h2>Your OTP: ${otp}</h2>`
    });
    console.log("Mail sent successfully to:", email);
  } catch (err) {
    console.error("Mail error:", err.message);
    throw err;
  }
};

module.exports = sendMail;