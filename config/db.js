const mysql = require('mysql');
const connection = mysql.createConnection({
    host        : 'localhost',
    port        : 3306,
    user        : 'root',
    password    : '12345',
    database    : 'matcha'
});

connection.connect(err => {
    if (err) 
        console.log(err);
    else
        console.log("Mysql connected.");
});
module.exports = connection;