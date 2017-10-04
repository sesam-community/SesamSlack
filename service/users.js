var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var fs = require("fs");
//var token = "xoxp-2167977614-159215739175-240563800673-9b4497b293b8bb809bf50309e7015b5d"; //process.env.Token;
var token = "xoxp-178195654566-197601969061-250606167120-83ff9f51b10627b93826a792d0675516";  // (test)
var web = new WebClient(token);
var exports = module.exports = {};


function setProfile(profile) {
  var ur = "https://slack.com/api/users.profile.set?token=" + token + "&user=U57BLUPUJ&"+ profile + "&pretty=1";    
   var opt = {
    url: ur,
    token: token,
    header: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type':  'application/x-www-form-urlencoded'
    }
  }
  request(opt, function (error, response, body) {
    if (!error) {
      console.log(response.statusCode);
      console.log(body);
    } else {
      console.log(response.statusCode);
    }
  });
}


exports.setImage = function(img) {
  var ur = "https://slack.com/api/users.setPhoto?token=" + token + "&user=U57BLUPUJ&mage=" + form+ "&pretty=1"; 
  var opt = {
  url: ur,
    header: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type':  'multipart/form-data'  
    }
  }

  var req = request.post(opt, function (err, resp, body) {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });

  var form = req.form();
  form.append('image', fs.createReadStream("../logo.png"));

}


 exports.inviteUser = function(email) {
  var ur = 'https://slack.com/api/users.admin.invite?token=' + token + '&email=' + email + '&pretty=1';
  var opt = {
    url: ur,
    token: token,
    header: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
  request(opt, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Status: 200");
      return "Status: 200";
    } else {
      return response.statusCode;
    }
  });
}

function deactivateUser(userId) {
  var ur = 'https://slack.com/api/users.admin.setInactive?token='
   + token + '&user=' + userId +"&scope=\"identify,read,post,client\"";
  var opt = {
    url: ur,
    header: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded',
      
    }
  }
  
  request(opt, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Deactivate user: " +userId+ " ok.");
      console.log(response.body);
      return response.statusCode;
    } else {
      console.log(body + " " + response.statusCode);
      return response.statusCode;
    }
  });
}

exports.PostUsers = function(req, res) {
  var userlist = req.body;  
  Object(userlist).forEach(function (element, key, _array) {
    if(element['id'] != "" && element["_deleted"]){
      deactivateUser(element['id']);
      
    }else if (element['id'] != "" && !element["_deleted"]) {
      console.log("updateprofile -- not implemented");
      // setProfile(element);

    } else if (element['id'] == "" && !element["_deleted"]){
      console.log("inviteuser -- not implemented")
      // inviteUser(element['email']);
    }
  });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("finished?");
};

exports.GetUserslist = function (res) {
  GetUsers(function (userlist) {
      userlist = userlist;
      Object(userlist.members).forEach(function (element, key, _array) {
        if (element["id"] == "USLACKBOT" || element["is_bot"] == true) {
        } else {
          element["_deleted"] = element["deleted"];
          element["_updated"] = element["updated"];
          element["_id"] = element["id"];
        }
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(userlist));
    });
 inviteUser("inger.elise.overa@bouvet.no");
console.log("Invited!");


var profile={'first_name':'PondusTrondus','last_name':'prompus'};
setProfile(profile);

};

GetUsers = function (callback) {
  web.users.list(function teamInfoCb(err, resonse) {
    if (err) {
      console.log('Error:', err);
    } else {
      return callback(resonse);
    }
  });
};

