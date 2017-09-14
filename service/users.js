var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var token = process.env.Token;
var web = new WebClient(token);
var exports = module.exports = {};

function setProfile(profile) {
  var test = {
    profile: {
      "first_name": "Trondemanns",
      "last_name": "Tufte",
      "image_original": "https:\/\/avatars.slack-edge.com\/2017-06-16\/199693409494_dda460e38c28f99c473c_original.jpg",
      "real_name": "Trond Tufte",
      "real_name_normalized": "Trond Tufte",
      "email": "trond.tufte@bouvet.no",
      "fields": null
    }
  };

  var test2 = { name: "Trond" };
  web.users.profile.set(test2, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Status: 200");
      // return callback(response);
    }
  });

}
function inviteUser(email) {
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
      console.log(response);
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


// exports.user = user;
