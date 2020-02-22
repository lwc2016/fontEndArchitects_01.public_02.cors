const mysql = require("mysql");
const co = require("co-mysql");
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "chart_db",
    connectionLimit : 10
})

const db = co(connection);
module.exports = db;