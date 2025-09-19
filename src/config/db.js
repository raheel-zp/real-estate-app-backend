const mongoose = require("mongoose");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
}

async function getMySQLConnection() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  return conn;
}

module.exports = { connectMongo, getMySQLConnection };