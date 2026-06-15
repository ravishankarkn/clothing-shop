const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhi",
  database: "clothing_shop"
});

db.connect((err) => {

  if (err) {

    console.log("FULL ERROR:");
    console.log(err);

  } else {

    console.log("MySQL Connected");

  }

});

module.exports = db;