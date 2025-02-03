const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "payment",
  password: process.env.DB_PASSWORD || "payment_1234",
  database: process.env.DB_NAME || "payment",
});

module.exports = db;
