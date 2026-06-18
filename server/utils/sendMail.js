const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
brevo.TransactionalEmailsApiApiKeys.apiKey,
process.env.BREVO_API_KEY
);

const sendMail = async (email, otp) => {
try {


console.log("Sending OTP to:", email);

await apiInstance.sendTransacEmail({
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
});

console.log("OTP sent successfully");


} catch (err) {


console.log(
  "Mail error:",
  err.message
);

throw err;


}
};

module.exports = sendMail;
