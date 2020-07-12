const mysql = require('mysql');
const connection = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : ''
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });

  const db = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : '',
    database    : 'matcha'
});
module.exports = db;