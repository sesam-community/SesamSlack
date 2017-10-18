var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var fs = require("fs");
var token = process.env.Token;
var web = new WebClient(token);
var exports = module.exports = {};


function setProfile(firstName, lastName,userProfile, userId) {
  var profile={'first_name': firstName,'last_name': lastName};

//   var profile = userProfile;
//  profile["first_name"] = firstName;
//  profile[ "last_name"] = lastName;

   var ur = "https://slack.com/api/users.profile.set?token=" + token + "&user="+ userId + "&profile={'first_name':'" + firstName + "','last_name':'"+ lastName + "'}"+"&pretty=1";    
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

function setImage(userId,imgUrl) {
  
   download(imgUrl, userId + '.png', function () {
   var img = fs.readFile(userId + '.png', function (err, data) {
    if (err) {
      console.log(+"Error downloading file: " + err);
      return;
    } else {
      var ur = "https://slack.com/api/users.setPhoto?token=" + token + "&user="+ userId + "&mage=" + form + "&pretty=1"; 
      var opt = {
      url: ur,
        header: {
          'User-Agent': 'Super Agent/0.0.1',
          'Content-Type':  'multipart/form-data'  
        }
      }
      var req = request.post(opt, function (err, response, body) {
        if (err) {
          console.log(err);
        } else {
          console.log(body);
        }
      });
    
      var form = req.form();
      form.append('image', fs.createReadStream(userId + ".png"));

    }

  });
});
 
 // form.append('image', fs.createReadStream(imgUrl));

}

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


exports.updateUser = function(request,response) { 
  if (request.method === "POST") {

      var imgUrl = "";
      var userId = "";
      var firstName = "";
      var lastName = "";
      var test = "";
      var profile = "";
      var userArray =   request.body;
      userArray.forEach(function (element) {
        profile = element["profile"];
        userId = element["id"];
        firstName = element["name"];
        lastName = element["lastName"];

        if (element["image"] != null) {
          test = element["image"];
          if (test["fit_thumb"]["url"] != null) {
            imgUrl = test["fit_thumb"]["url"];
          }
        }

     console.log("Current token: " + token);
     setImage(userId, imgUrl);
     setProfile(firstName, lastName,profile, userId);
      response.writeHead(200, { "Content-Type": "application/json" });  
      response.end(JSON.stringify(element));
      });

  }

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
        //setProfile(element);
    } else if (element['id'] == "" && !element["_deleted"]){
        inviteUser(element['email']);
    }
  });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("finished?");
};

exports.Deactivate = function(req, res) {
  var userlist = req.body;  
  Object(userlist).forEach(function (element, key, _array) {
    if(element['id'] != "" && element["_deleted"]){
      deactivateUser(element['id']);      
    }
  });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("finished?");
}

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
