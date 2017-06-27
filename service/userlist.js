var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var token = process.env.Token;
var web = new WebClient(token);

function userlist(req,res){

    if(req.method == "POST"){    
        console.log(req.body);
        
        //UpdateUsergroupUsers(req.post);
    } else {
        console.log("else.");
    }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.body));
};

function UpdateUsergroupUsers(userlist) {
    console.log(userlist);
    var usergroup = userlist["bouvet-department-employee:id"];
    
    console.log(usergroup);
    
}

exports.userlist = userlist;