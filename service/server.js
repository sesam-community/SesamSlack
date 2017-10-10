var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var host = "0.0.0.0";
var port = 5000;
var userGroups = require('./userGroups');
var users = require('./users');
var userList = require('./userlist');
app.use(bodyParser.json());



app.route('/update')
.get(function(req, res) {
    console.log("HTTP Get on /updateUser")
}).post(function(req, res) {
    console.log("HTTP Post on /updateUser")
    users.updateUser(req, res);    
});


app.route('/users')
.get(function(req, res) {
    console.log("HTTP Get on /users")
    users.GetUserslist(res);
}).post(function(req, res) {
    console.log("HTTP Post on /users")
    users.PostUsers(req, res);    
});

app.route('/usergroups')
.get(function(req, res) {
    console.log("HTTP Get on /usergroups")
    userGroups.Getusergroups(req, res);
}).post(function(req, res) {
    console.log("HTTP Post on /usergroups")
    userGroups.PostGroup(req, res);    
});

app.route('/userlist')
.get(function(req, res) {
    console.log("HTTP Get on /userlist")
}).post(function(req, res) {
    console.log("HTTP Post on /usergroups")
    userList.UpdateUsergroupmembers(req, res);
});


// app.route('/photo')
// .get(function(req, res) {
//     console.log("HTTP Get on /photo")
// }).post(function(req, res) {
//     console.log("HTTP Post on /photo")
//    // users.setImage(req, res);
// });

app.listen(5000, function () {
    console.log('SesamSlack app listening on port 5000.');
});

