var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var token = process.env.Token;
var web = new WebClient(token);

exports.UpdateUsergroupmembers = function(req,res){
      var data = req.body;    
      var usergroup = data["id"];
      var userlist = [];
      Object(data.employees).forEach(function (element, key, _array) {
        if (element["id"] == "USLACKBOT" || element["id"] == null) {
            console.log("Missing employee id")
        } else {
          userlist.push(element["id"]);
        }
      });
      UpdateMembers(usergroup, userlist); 
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.body));
};

function UpdateMembers(usergroup, userlist) {
    console.log(userlist);
    console.log(usergroup);
    
}

