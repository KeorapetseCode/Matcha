var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db');
var geo_tools = require('geolocation-utils');
const { NULL } = require('mysql/lib/protocol/constants/types');
var secretString = Math.floor((Math.random() * 10000) + 1);


router.get('/', (req, res) => {
    if (req.session.user && req.session) {

        connection.query('SELECT * FROM user_filters WHERE username= ?', [req.session.user], (err1, rows1) => {
            if (err1) console.log(err1);
            else
            {   
                if (rows1.[0].Hobby1 != "None"){
                    
                }
                /*let filter3 = "#" + rows1[0].Hobby;
                req.session.filters = {
                    'filter3' : filter3
                }
                */
                let age_min;
                let age_max;
                let fame_min;
                let fame_max;
                let distance_array = [];
                //rows1[0].Hobby1 = "None";
                console.log("In Theere");
                console.log(rows1[0]);
//             ----------------------------------------All Filters Fields Blank----------------------------------
               
                if (rows1[0].Age == "None" && rows1[0].Fame_rating == "None" && rows1[0].Hobby1 == "None") {
                    
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                     "`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,"+
                                    "`users`.`Bio`, `users`.`profile_pic`,`users`.`Latitude`, `users`.`Longitude`,"+
                                    "`user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`,"+
                                    "`user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN"+
                                    "`user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username`"+
                                    "!= ? ORDER BY `users`.`fame_rating` DESC", [req.session.user], (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            req.session.search_results_backup = users;
                            
                            var x = 0;
                            while (users[x]) {
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
        
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
//                  --------------------------------------Only Age Filter---------------------------------------------------
                else if (rows1[0].Age != "None" && rows1[0].Fame_rating == "None" && rows1[0].Hobby1 == "None"){
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    else if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    else if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    else if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    else if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    else if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    else if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    else if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                    "`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,"+
                                    "`users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`,"+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5`"+
                                    " FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username`"+
                                    "WHERE `users`.`username` != ? AND `users`.`Age` >= ? AND `users`.`Age` <= ? ORDER BY "+
                                    "`users`.`fame_rating` DESC", [req.session.user, age_min, age_max], (err, users) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("Age present");
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;                            
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
//                  --------------------------------------Age And Fame Filter---------------------------------------------------
                
                else if (rows1[0].Age != "None" && rows1[0].Fame_rating != "None" && rows1[0].Hobby1 == "None"){
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                    }
                    else if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                    }
                    else if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                    }
                    else if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                    }
                    else if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                    }
                    else if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                    }
                    else if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                    }
                    else if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                    }
//                                                  ------FAME RANGE--------
                    if (rows1[0].Fame_rating == "0-10"){
                        fame_min = 0;
                        fame_max = 10;
                    }
                    else if (rows1[0].Fame_rating == "11-15"){
                        fame_min = 11;
                        fame_max = 15;
                    }
                    else if (rows1[0].Fame_rating == "51-100"){
                        fame_min = 51;
                        fame_max = 100;
                    }
                    else if (rows1[0].Fame_rating == "101-Above"){
                        fame_min = 101;
                        fame_max = 100000;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                    "`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,"+
                                    "`users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`,"+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5`"+
                                    " FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username`"+
                                    "WHERE `users`.`username` != ? AND `users`.`Age` >= ? AND `users`.`Age` <= ? "+
                                    "AND `users`.`fame_rating` >= ? AND `users`.`fame_rating` <= ?",
                                    [req.session.user, age_min, age_max, fame_min, fame_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersH");
                        }
                        else {
                            console.log("Age and Fame Present");
                            console.log(users);
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
//                  ------------------------------------FAME only--------------------------------------------------

                else if (rows1[0].Age == "None" && rows1[0].Fame_rating != "None" && rows1[0].Hobby1 == "None"){  
                    if (rows1[0].Fame_rating == "0-10"){
                        fame_min = 0;
                        fame_max = 10;
                    }
                    else if (rows1[0].Fame_rating == "11-15"){
                        fame_min = 11;
                        fame_max = 15;
                    }
                    else if (rows1[0].Fame_rating == "51-100"){
                        fame_min = 51;
                        fame_max = 100;
                    }
                    else if (rows1[0].Fame_rating == "101-Above"){
                        fame_min = 101;
                        fame_max = 100000;
                    }
                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                    "`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,"+
                                    "`users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`,"+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5`"+
                                    " FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username`"+
                                    "WHERE `users`.`username` != ? AND `users`.`fame_rating` >= ? AND `users`.`fame_rating` <= ?"+
                                    " ORDER BY `users`.`fame_rating` DESC", [req.session.user, fame_min, fame_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersH");
                        }
                        else {
                            console.log("Fame Rating Only");
                            //console.log(users);
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
//                              ---------------------------------Hobby only-----------------------   

                else if (rows1[0].Age == "None" && rows1[0].Fame_rating == "None" && rows1[0].Hobby1 != "None"){  
                    let a = 0;
                    console.log("dfddfdf");

                    console.log(hobbyArr[0]);

                    connection.query("SELECT `users`.`username`,`users`.`last_seen`,`users`.`Gender`,`users`.`Firstname`,"+
                                    "`users`.`fame_rating`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,"+
                                    "`users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`,"+
                                    "`user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5`"+
                                    " FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username`"+
                                    "WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` == ?)",
                                    [req.session.user, rows1[0].Hobby1], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch usersH");
                        }
                        else {
                            console.log("Fame Rating Only");
                            //console.log(users);
                            req.session.search_results_backup = users;
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
            }
        })
    }
        else {
            res.redirect('/login')
        }
    })

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    else{
        let hobbyStr = req.body.multHobbies;
        var hobbyArr = [];

        req.session.filters2 = {
            age: req.body.filter1,
            Fame_rating: req.body.filter2,
            Hobby1: 'None',
            Hobby2: 'None', 
            Hobby3: 'None',
            Hobby4: 'None',
            Hobby5: 'None'
        };
        let x = 0;
        let n = hobbyStr.search('\n');
        hobbyArr = hobbyStr.split("\n");
        if (n > 0){
            while (hobbyArr[x]){
                if (x == 0){
                    req.session.filters2.Hobby1 = hobbyArr[x];
                }
                else if (x == 1){
                    req.session.filters2.Hobby1 = req.session.filters2.Hobby1.replace('\r', '');  
                    req.session.filters2.Hobby2 = hobbyArr[x];
                }
                else if (x == 2){
                    req.session.filters2.Hobby2 = req.session.filters2.Hobby2.replace('\r', '');
                    req.session.filters2.Hobby3 = hobbyArr[x];
                }
                else if (x == 3){
                    req.session.filters2.Hobby3 = req.session.filters2.Hobby3.replace('\r', ''); 
                    req.session.filters2.Hobby4 = hobbyArr[x];
                }
                else if (x == 4){
                    req.session.filters2.Hobby4 = req.session.filters2.Hobby4.replace('\r', '');   
                    req.session.filters2.Hobby5 = hobbyArr[x];
                }
                x++;
            }
        }
        else if (n < 0){
            if (hobbyArr[x]) req.session.filters2.Hobby1 = hobbyArr[x];
        }
    //    console.log("Response");
    //    console.log(req.session.filters2);
        session = req.session;
        let sql = 'UPDATE user_filters SET Age = ?, Fame_rating = ?, Hobby1 = ?, Hobby2 = ?, Hobby3 = ?,'+
                    ' Hobby4 = ?, Hobby5 = ? WHERE username = ?';
        connection.query(sql, [req.body.filter1, req.body.filter2, req.session.filters2.Hobby1, req.session.filters2.Hobby2,
                        req.session.filters2.Hobby3, req.session.filters2.Hobby4, req.session.filters2.Hobby5, session.user],
                         (err) => {
            if (err) console.log(err); 
        });
        res.redirect('/search_match');
    }
});


module.exports = router;