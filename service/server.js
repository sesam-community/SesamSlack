var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var host = "0.0.0.0";
var port = 5000;
var userGroups = require('./usergroups');
var users = require('./users');
var userList = require('./userlist');
app.use(bodyParser.json());

app.route('/users')
.get(function(req, res) {
    users.GetUserslist(res);
}).post(function(req, res) {
    users.PostUsers(req, res);    
});

app.route('/usergroups')
.get(function(req, res) {
    userGroups.Getusergroups(req, res);
}).post(function(req, res) {
    userGroups.PostGroup(req, res);    
});

app.route('/userlist')
.get(function(req, res) {
    console.log("mjess");
}).post(function(req, res) {
    userList.UpdateUsergroupmembers(req, res);
});

app.listen(5000, function () {
    console.log('Example app listening on port 5000.');
});

