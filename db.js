const mysql = require("mysql2");

// Create the connection pool.
const conn = mysql.createConnection({
  host: "localhost",
  user: "W3_87118_Pratik",
  password: "manager",
  database: "hack",
});

module.exports = conn;
