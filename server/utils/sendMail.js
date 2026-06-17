const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
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
    console.log("Mail sent successfully to:", email); // ← add this
  } catch (err) {
    console.error("Mail error:", err.message); // ← add this
    throw err;
  }
};

module.exports = sendMail;