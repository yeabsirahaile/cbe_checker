const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1", // Ensure IPv4 is used
  user: process.env.DB_USER || "phpmyadmin",
  password: process.env.DB_PASSWORD || "yegara",
  database: process.env.DB_NAME || "payment_a",
  port: 3306,
  // Force IPv4 resolution
  multipleStatements: true,
});

module.exports = db;
