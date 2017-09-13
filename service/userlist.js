var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var token = process.env.Token;
var web = new WebClient(token);

exports.UpdateUsergroupmembers = function(req,res){
      var data = req.body;    
      Object(data).forEach(function (element, key, _array) {
        var usergroup = element["id"];
        var userlist = []; 
        if(!element["_deleted"]) {
            Object(element.employees).forEach(function(employee, key, _array) {
                if (employee["id"] == "USLACKBOT" || employee["id"] == null) {
                    console.log("Missing employee id");
                } else {
                    userlist.push(employee["id"]);
                }
            });
            if(userlist.length > 0) {
                UpdateMembers(usergroup, userlist, function(response){
                });
            }
        } else {
            Console.log("Delete / Deactive / Remove -- ikke implementert")
        }
        


      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end();    
        
};

function UpdateMembers(us, ulist , callback) {
    var usergroup = us;
    var users = ulist.join();
    var opts = {};
    web.usergroups.users.update(usergroup, users, opts, function(err, response) {
        if (err) {
            console.log("Error: " +usergroup +" : " +err);
            return callback(err);
        } else {
            console.log("Oppdatert brukere for:" +usergroup);
            return callback(response);
        }
    });


}

