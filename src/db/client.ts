
// db/client.ts

import mysql from 'mysql2';

// Loads environment variables from the .env file
require('dotenv').config();

// Client creation
const client = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : 3306
});

// Table creation if doesn't exist
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
    } else {
      console.log('Table "schools" created or already exists.');
    }
  });
};

// Call the createTable function to ensure the table is created
createTable();

export default client;
