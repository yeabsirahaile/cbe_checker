const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "phpmyadmin",
  password: process.env.DB_PASSWORD || "yegara",
  database: process.env.DB_NAME || "payment_a",
  port: 3306, // Ensure the port is explicitly defined
});

module.exports = db;
