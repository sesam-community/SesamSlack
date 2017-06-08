// Load the http module to create an http server.
var http = require('http');
var Router = require('node-simple-router');
var url = require('url');

var token = process.env.slacktoken;

//variables
var host = "localhost";
var port = "5000";
var userlist;



function DataAccessLayer() {
  var WebClient = require('@slack/client').WebClient;
  
  var web = new WebClient(token);
  
  this.GetUsers = function (callback) {
    web.users.list(function teamInfoCb(err, info) {
      if (err) {
        console.log('Error:', err);
      } else {        
        return callback(info);
      }
    });
  };

  this.GetUsergroups = function (callback) {
    web.usergroups.list(function teamInfoCb(err, info) {
      if (err) {
        console.log('Error:', err);
      } else {        
        return callback(info);
      }
    });
  };

  this.UpdateUser = function (user, callback) {
      var userprofile = this.SlackProfile(user);
      
      var profile = JSON.stringify(userprofile.profile);
      var user = JSON.stringify(userprofile.user);
      console.log(typeof user +user);
      console.log(typeof profile +profile);
      web.users.profile.set({user, profile}, function (err, stringprofile) {
        if (err) {
          console.log("Err: " +err)
      } else {        
        return callback(info);
      }
      });
      // web.users.profile.set(user, profile);
  };

  this.SlackProfile = function (user) {
    var userprofile = {};        
    userprofile["user"] = user["_id"].split(":")[1];  
    
    var slackprofile = {};
    // var last_name = {
    //   last_name : (user["slack-profile:last_name"].toString().length > 0 ? user["slack-profile:last_name"].toString() : "")
    // };
    // var first_name = {
    //   first_name : (user["slack-profile:first_name"].toString().length > 0 ? user["slack-profile:first_name"].toString() : "" )
    // };
    
    
    
    slackprofile["first_name"] = (user["slack-profile:first_name"].toString().length > 0 ? user["slack-profile:first_name"].toString() : "" );
    slackprofile["last_name"] = (user["slack-profile:last_name"].toString().length > 0 ? user["slack-profile:last_name"].toString() : "");
          
    userprofile["profile"] =  slackprofile;
    
    return userprofile;
  };


  this.UpdateUsergroup = function (group) {

  }

  // this.deactivateUser = function(user, callback) {
  //   web.users.deactivateUser
  // }
}


var dataAccessLayer = new DataAccessLayer();
var router = Router();

//henter users fra slack. 
router.get("/users", function (request, response) {
  dataAccessLayer.GetUsers(function(userlist) {
    Object(userlist.members).forEach(function(element, key, _array) {
      if(element["id"] == "USLACKBOT" || element["is_bot"] == true) {
        console.log(element["name"]);
        //userlist.members.remove(element);
      } else {
        element["_deleted"] = element["deleted"];
        element["updated"] = element["updated"];
        element["_id"] = element["id"];
      }
      
    })
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(userlist));
  })
});

router.get("/usergroups", function (request, response) {
  var since = url.parse(request.url, true).query.since;
  dataAccessLayer.GetUsergroups(function(usergrouplist) {
      Object.keys(usergrouplist.usergroups).forEach(function(element, key, _array) {
      var deleted;
      console.log(usergrouplist.usergroups[element]["deleted_by"])
      if(usergrouplist.usergroups[element]["deleted_by"]) {
        deleted = true;
      } else {
        deleted = false;
      }   
      usergrouplist.usergroups[element]["_deleted"] = deleted;
      usergrouplist.usergroups[element]["_updated"] = usergrouplist.usergroups[element]["date_update"];
      usergrouplist.usergroups[element]["_id"] = usergrouplist.usergroups[element]["id"];
    })
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(usergrouplist));
  })
});

router.post('/users', function(request, response) {   
    var users = request.post;
    Object(users.users).forEach(function(element, key, _array) {
      console.log("foreach element");
      if(element["_deleted"]) {
      //   dataAccessLayer.deactivateUser(element, function(user) {        
      //     response.end(JSON.stringify(request.post));
      // });
        console.log("deactivate");
      } else {
        dataAccessLayer.UpdateUser(element, function(new_user_id) {        
          
      });
      }
      
    })
    response.end(JSON.stringify(request.post));

});

router.post('/usergroups', function(request, response) {   
    var usergroups = request.post;
    Object(usergroups.groups).forEach(function(element, key, _array) {
      console.log(element);
      if(element["_deleted"]) {
      //   dataAccessLayer.deactivateUser(element, function(user) {        
      //     response.end(JSON.stringify(request.post));
      // });
        console.log("deactivate");
      } else {
        dataAccessLayer.UpdateUsergroup(element, function(new_user_id) {        
          
      });
      }
      
    })
    response.end(JSON.stringify(request.post));

});

// Configure our HTTP server to use router function
var server = http.createServer(router);

// Listen on port 5000, IP defaults to 127.0.0.1
server.listen(port, host);

// Put a friendly message on the terminal
console.log("Server running at http://" +host +":" +port);