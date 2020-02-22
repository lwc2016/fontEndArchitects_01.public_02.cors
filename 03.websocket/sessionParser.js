const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'session_test'
};
var sessionStore = new MySQLStore(options);
module.exports = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false,
    store: sessionStore
})