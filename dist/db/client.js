"use strict";
// db/client.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// Load environment variables from the .env file
require('dotenv').config();
// Create the MySQL client
const client = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 30000,
    port: 53295
});
// Create the table if it doesn't exist
const createTable = () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    );
  `;
    client.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        }
        else {
            console.log('Table "schools" created or already exists.');
        }
    });
};
// Call the createTable function to ensure the table is created
createTable();
// Export the client for use in other files
exports.default = client;
