const axios = require("axios");

const sendMail = async (email, otp) => {
try {

console.log("Sending OTP to:", email);

await axios.post(
  "https://api.brevo.com/v3/smtp/email",

  {
    sender: {
      name: "Clothing Shop",
      email: "ravishankarkn2003@gmail.com"
    },

    to: [
      {
        email: email
      }
    ],

    subject: "Verify Email",

    htmlContent: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
    `
  },

  {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    }
  }
);

console.log("OTP sent successfully");


} catch (err) {


console.log(
  "Mail error:",
  err.response?.data || err.message
);

throw err;

}
};

module.exports = sendMail;
