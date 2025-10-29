const mysql2 = require('mysql2/promise');
require('dotenv').config();

let connection

const connectToDatabase = async () =>{
    if(!connection){
        connection =  await mysql2.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            port: process.env.MYSQL_PORT,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
    }
    return connection;
}

module.exports = {connectToDatabase};