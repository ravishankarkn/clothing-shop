const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
service: "gmail",

auth: {
user: "ravishankarkn2003@gmail.com",
pass: "wubw jybn agph vcch"
}
});

const sendMail = async (email, otp) => {

await transporter.sendMail({

from: "ravishankarkn2003@gmail.com",

to: email,

subject: "Verify Email",

html: `<h2>Your OTP: ${otp}</h2>`

});

};

module.exports = sendMail;