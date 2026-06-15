const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../config/db");

const sendMail =
require("../utils/sendMail");

const JWT_SECRET =
process.env.JWT_SECRET ||
"your_secret_key";


// =========================
// REGISTER
// =========================

router.post(
"/register",

async (req,res)=>{

try{

const {
name,
email,
password
}=req.body;

const cleanEmail =
email
.trim()
.toLowerCase();

db.query(

"SELECT id FROM users WHERE email=?",

[cleanEmail],

async(err,result)=>{

if(err){

return res
.status(500)
.json({
message:"Server Error"
});

}

if(result.length>0){

return res
.status(400)
.json({
message:
"Email already registered"
});

}

const hashed =
await bcrypt.hash(
password,
10
);

const otp =
Math.floor(
100000+
Math.random()*900000
).toString();

db.query(

`
INSERT INTO users
(
name,
email,
password,
otp,
is_verified
)
VALUES
(
?,
?,
?,
?,
false
)
`,

[
name,
cleanEmail,
hashed,
otp
],

async(err)=>{

if(err){

return res
.status(500)
.json({
message:
"Registration Failed"
});

}

try{

await sendMail(
cleanEmail,
otp
);

res.json({

success:true,

message:
"OTP Sent To Email"

});

}

catch{

res
.status(500)
.json({

message:
"Email Send Failed"

});

}

}

);

}

);

}

catch{

res
.status(500)
.json({

message:
"Server Error"

});

}

}

);


// =========================
// VERIFY OTP
// =========================

router.post(
"/verify",

(req,res)=>{

const {
email,
otp
}=req.body;

db.query(

`
SELECT *
FROM users
WHERE email=?
AND otp=?
`,

[
email,
otp
],

(err,result)=>{

if(err){

return res
.status(500)
.json({
message:
"Server Error"
});

}

if(result.length===0){

return res
.status(400)
.json({
message:
"Invalid OTP"
});

}

const user =
result[0];

db.query(

`
UPDATE users
SET
is_verified=true,
otp=NULL
WHERE email=?
`,

[email],

(updateErr)=>{

if(updateErr){

return res
.status(500)
.json({
message:
"Verification Failed"
});

}

const token =
jwt.sign(

{
id:user.id,
role:user.role
},

JWT_SECRET,

{
expiresIn:"1d"
}

);

res.json({

success:true,

message:
"Email Verified",

token,

id:user.id,

role:user.role,

name:user.name

});

}

);

}

);

}

);


// =========================
// LOGIN
// =========================

router.post(
"/login",

(req,res)=>{

const {
email,
password
}=req.body;

const cleanEmail =
email
.trim()
.toLowerCase();

db.query(

"SELECT * FROM users WHERE email=?",

[cleanEmail],

async(err,result)=>{

if(err){

return res
.status(500)
.json({
message:
"Server Error"
});

}

if(result.length===0){

return res
.status(401)
.json({
message:
"Invalid Email"
});

}

const user =
result[0];

if(!user.is_verified){

return res
.status(401)
.json({
message:
"Verify your email first"
});

}

const match =
await bcrypt.compare(
password,
user.password
);

if(!match){

return res
.status(401)
.json({
message:
"Invalid Password"
});

}

const token =
jwt.sign(

{
id:user.id,
role:user.role
},

JWT_SECRET,

{
expiresIn:"1d"
}

);

res.json({

success:true,

message:
"Login Successful",

token,

id:user.id,

role:user.role,

name:user.name

});

}

);

});


// =========================
// FORGOT PASSWORD
// =========================

router.post(
"/forgot-password",

async(req,res)=>{

try{

const {
email
}=req.body;

const otp =
Math.floor(
100000+
Math.random()*900000
).toString();

db.query(

`
UPDATE users
SET otp=?
WHERE email=?
`,

[
otp,
email
],

async(err,result)=>{

if(err){

return res
.status(500)
.json({
message:
"Server Error"
});

}

if(
result.affectedRows===0
){

return res
.status(404)
.json({
message:
"Email not found"
});

}

await sendMail(
email,
otp
);

res.json({

success:true,

message:
"OTP Sent"

});

}

);

}

catch{

res
.status(500)
.json({
message:
"Server Error"
});

}

});


// =========================
// RESET PASSWORD
// =========================

router.post(
"/reset-password",

async(req,res)=>{

try{

const {
email,
otp,
password
}=req.body;

const hashed =
await bcrypt.hash(
password,
10
);

db.query(

`
UPDATE users

SET
password=?,
otp=NULL

WHERE
email=?
AND
otp=?
`,

[
hashed,
email,
otp
],

(err,result)=>{

if(err){

return res
.status(500)
.json({
message:
"Server Error"
});

}

if(
result.affectedRows===0
){

return res
.status(400)
.json({
message:
"Invalid OTP"
});

}

res.json({

success:true,

message:
"Password Updated"

});

}

);

}

catch{

res
.status(500)
.json({
message:
"Server Error"
});

}

});

module.exports =
router;