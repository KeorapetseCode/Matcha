const connection = require('../config/db');
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
//const session = require('express-session');
const unirest = require('unirest');
const ip_loc = require('ip-locator');
//const iplocation = require('iplocation');

router.get('/', (req, res) => res.render('register', {error: 'non'}));

router.post('/', (req, res) => {
    if (!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.age 
        || !req.body.email || !req.body.password || !req.body.vPassword)
       res.render('register', {error: 'Please complete form fields'});
    else if (req.body.password != req.body.vPassword)
        res.render('register', {error: 'Passwords do not match'});
    else if (req.body.password.length < 8)
        res.render('register', {error: 'Password must contain 8 or more characters'});
    else if (req.body.password.search(/\d/) == -1)
        res.render('register', {error: 'Password must contain atleast 1 number'});
    else if (req.body.password.search(/[a-z]/) == -1)
        res.render('register', {error: 'Password must contain atleast 1 small letter'});
    else if (req.body.password.search(/[A-Z]/) == -1)
        res.render('register', {error: 'Password must contain atleast 1 capital letter'});
    else
    {
        const { username, firstname, lastname, age, email }
            = req.body;
        
        let sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        
        connection.query(sql, [username, email], (err, rows) => {
            if (err)
                res.render('register', {msg: 'none', error: 'Sorry, failed to connect to database. Please try again'});
            else 
            {
                if (rows[0] && rows[0].Email.toLowerCase() == email.toLowerCase())
                    res.render('register', {msg: 'none', error: 'user email already taken'});
                else if (rows[0] && rows[0].username.toLowerCase() == username.toLowerCase())
                    res.render('register', {msg: 'none', error: 'username already taken'});
                else
                {
                    const hash = bcrypt.hashSync(req.body.password, 12)
                    
                    sql = 
                        'INSERT INTO `users` (`username`, `Firstname`, `Lastname`, `Age`, `Email`, `Password`, `profile_pic`, `Orientation`)' +
                        ' VALUES (?, ?, ?, ?, ?, ?, "Uploads/stock_profile_pic.png", "Bisexual")';
                    
                    connection.query(sql, [username, firstname, lastname, age, email, hash], err => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
                    });

                    sql = 'INSERT INTO `user_hobbies` (`username`) VALUES (?)';
                    connection.query(sql, [username], (err) => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
                    });

                    sql = 'INSERT INTO `user_filters` (`username`, `Age`, `Orientation`) VALUES (?, "None", "None")';
                    connection.query(sql, [username], (err) => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
                    });

                    const token = (Math.random() + 1).toString(36).substr(2, 15)
                    sql = 'UPDATE users SET Reset_token = ? WHERE Email = ?';
                    connection.query(sql, [token, email], (err) => {
                        if (err)
                            res.render('register' , {msg: 'none', error: 'Sorry, failed to connect to database. Please try again'});   
                    });
                    var url = '<a href="' + req.protocol + '://' + req.get('host') + '/Verify_email/' + token + '">Verify your Account creation</a>'
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            port: 587,
                            secure: false,
                            auth:
                            {
                                user: 'koketsomatjeke.matcha@gmail.com',
                                pass: 'LieThatTellsTheTruth'
                            }
                        });
                        console.log("transport created");
                        let mailOptions = transporter.sendMail({
                            from: 'koketsomatjeke.matcha@gmail.com', // sender address
                            // to: req.body.Email, // list of receivers
                            to: req.body.email, // list of receivers
                            subject: 'Account verification', // Subject line
                            html: '<p>Click Here to verify your account creation ' + url + '</p>'// plain text body
                        });
                        console.log(req.body.email)
                        console.log("email sent")

                    // var apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');
                    // apiCall.end((response) => {
                    //     if (!response.body.length)
                    //         res.render({msg: 'we need a message here'});
                    //     else {
                    //         ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
                    //             if (err)
                    //                 res.render('login', {msg: 'we need a message here'});
                    //             else{
                    //                 sql = "UPDATE users SET Longitude = ? WHERE username = ?";
                    //                 connection.query(sql, [data.lon, username], err => {
                    //                     if (err)
                    //                         res.render('login', {msg: 'we need a message here'});
                    //                     console.log('longitude updated');
                    //                 });
                                    
                    //                 sql = "UPDATE users SET Latitude = ? WHERE username = ?";
                    //                 connection.query(sql, [data.lat, username], err => {
                    //                     if (err)
                    //                         res.render('login', {msg: 'we need a message here'});
                    //                     console.log('latitude updated')
                    //                 });

                    //                 sql = "UPDATE users SET City = ? WHERE username = ?";
                    //                 connection.query(sql, [data.city, username], err => {
                    //                     if (err)
                    //                         res.render('login', {msg: 'we need a message here'});
                    //                     console.log('city updated')
                    //                 });
                    //             }
                    //         });
                    //     }
                    // });
                    res.render('login' , {msg: 'check email to verify account', error: 'none'});
                }
            }
        });
    }
});

module.exports = router;





























































//const nodemailer = require('nodemailer');
//const session = require('express-session');
//const iplocation = require('iplocation');
// const connection = require('../config/db');
// const express = require('express');
// const router = express.Router();

// const bcrypt = require('bcryptjs');

// const unirest = require('unirest');
// const ip_loc = require('ip-locator');


// router.get('/', (req, res) => res.render('register', {error: 'non'}));

// router.post('/', (req, res) => {
//     if (!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.age 
//         || !req.body.email || !req.body.password || !req.body.vPassword)
//        res.render('register', {error: 'Please complete form fields'});
//     else if (req.body.password != req.body.vPassword)
//         res.render('register', {error: 'Passwords do not match'});
//     else if (req.body.password.length < 8)
//         res.render('register', {error: 'Password must contain 8 or more characters'});
//     else if (req.body.password.search(/\d/) == -1)
//         res.render('register', {error: 'Password must contain atleast 1 number'});
//     else if (req.body.password.search(/[a-z]/) == -1)
//         res.render('register', {error: 'Password must contain atleast 1 small letter'});
//     else if (req.body.password.search(/[A-Z]/) == -1)
//         res.render('register', {error: 'Password must contain atleast 1 capital letter'});
//     else
//     {
//         const { username, firstname, lastname, age, email }
//             = req.body;
        
//         let sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        
//         connection.query(sql, [username, email], (err, rows) => {
//             if (err)
//                 res.render('register', {msg: 'none', error: 'Sorry, failed to connect to database. Please try again'});
//             else 
//             {
//                 if (rows[0] && rows[0].Email.toLowerCase() == email.toLowerCase())
//                     res.render('register', {msg: 'none', error: 'user email already taken'});
//                 else if (rows[0] && rows[0].username.toLowerCase() == username.toLowerCase())
//                     res.render('register', {msg: 'none', error: 'username already taken'});
//                 else
//                 {
//                     const hash = bcrypt.hashSync(req.body.password, 12)
                    
//                     sql = 
//                         'INSERT INTO `users` (`username`, `Firstname`, `Lastname`, `Age`, `Email`, `Password`, `profile_pic`, `Orientation`)' +
//                         ' VALUES (?, ?, ?, ?, ?, ?, "Uploads/stock_profile_pic.png", "bisexual")';
                    
//                     connection.query(sql, [username, firstname, lastname, age, email, hash], err => {
//                         if (err)
//                             res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
//                     });

//                     sql = 'INSERT INTO `user_hobbies` (`username`) VALUES (?)';
//                     connection.query(sql, [username], (err) => {
//                         if (err)
//                             res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
//                     });

//                     sql = 'INSERT INTO `user_filters` (`username`, `Age`, `Orientation`) VALUES (?, "None", "None")';
//                     connection.query(sql, [username], (err) => {
//                         if (err)
//                             res.render('register' , {msg: 'none', error: 'failed to connect to database. Please try again'});
//                     });

//                     const token = (Math.random() + 1).toString(36).substr(2, 15)
//                     sql = 'UPDATE users SET Reset_token = ? WHERE Email = ?';
//                     connection.query(sql, [token, email], (err) => {
//                         if (err)
//                             res.render('register' , {msg: 'none', error: 'Sorry, failed to connect to database. Please try again'});
//                     });

//                     let apiCall = unirest('GET', 'https://get.geojs.io/v1/ip');
//                     apiCall.end((response) => {
//                         if (!response.body.length)
//                             res.render({msg: 'we need a message here'});
//                         else {
//                             ip_loc.getDomainOrIPDetails(response.body, 'json', (err, data) => {
//                                 if (err)
//                                     res.render('login', {msg: 'we need a message here'});
//                                 else{
//                                     sql = "UPDATE users SET Longitude = ? WHERE username = ?";
//                                     connection.query(sql, [data.lon, username], err => {
//                                         if (err)
//                                             res.render('login', {msg: 'we need a message here'});
//                                         console.log('longitude updated');
//                                     });
                                    
//                                     sql = "UPDATE users SET Latitude = ? WHERE username = ?";
//                                     connection.query(sql, [data.lat, username], err => {
//                                         if (err)
//                                             res.render('login', {msg: 'we need a message here'});
//                                         console.log('latitude updated')
//                                     });

//                                     sql = "UPDATE users SET City = ? WHERE username = ?";
//                                     connection.query(sql, [data.city, username], err => {
//                                         if (err)
//                                             res.render('login', {msg: 'we need a message here'});
//                                         console.log('city updated')
//                                     });
//                                 }
//                             });
//                         }
//                     });
//                     res.render('login' , {msg: 'check email to verify account', error: 'none'});
//                 }
//             }
//         });
//     }
// });

// module.exports = router;