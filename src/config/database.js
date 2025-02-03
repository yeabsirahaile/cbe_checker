const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: "127.0.0.1", // Ensure IPv4 is used
  user: "phpmyadmin",
  password: "yegara",
  database: "payment_a",
  port: 3306,
  // Force IPv4 resolution
  multipleStatements: true,
});

module.exports = db;
