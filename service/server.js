// Load the http module to create an http server.
var http = require('http');
var Router = require('node-simple-router');
var url = require('url');


var token = process.env.slacktoken;

//variables
var host = "0.0.0.0";
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

  

  this.UpdateUser = function (user, callback) {
      
      var userprofile = this.SlackProfile(user);
      var profilestring = JSON.stringify(userprofile.profile);
      var userid = JSON.stringify(userprofile.user);
      var optionobject = {};
      
      
      var opts = {
        user  : userprofile.user,
        profile : userprofile.profile
      };
      // console.log(opts);
      console.log(JSON.stringify(userprofile));
      web.users.profile.set(JSON.stringify(userprofile), function (err, userprofile) {
        if (err) {
          console.log("Err: " +err);
      } else {        
        console.log("Worx: " +err);
        return callback(info);
      }
      });
      // web.users.profile.set(user, profile);
  };

  this.SlackProfile = function (user) {
    var userprofile = {};        
    userprofile["user"] = user["_id"].split(":")[1];  
    
    var slackprofile = {};    
    // slackprofile["first_name"] = (user["slack-profile:first_name"].toString().length > 0 ? user["slack-profile:first_name"].toString() : "" );
    // slackprofile["last_name"] = (user["slack-profile:last_name"].toString().length > 0 ? user["slack-profile:last_name"].toString() : "");
    slackprofile["first_name"] = "Trond";
    slackprofile["last_name"] = "Tufte";
    userprofile["profile"] =  slackprofile;
    return userprofile;
  };

  this.deactivateUser = function (user, callback) {
    web.makeAPICall('users.admin.setInactive', user["user"],  function (err, user) {
        if (err) {
          console.log("Err: " +err);
      } else {        
        console.log("Worx: " +user);
        return callback(user);
      }
    }
    )};





  // this.deactivateUser = function(user, callback) {
  //   web.users.deactivateUser
  // }
}


var dataAccessLayer = new DataAccessLayer();
const uga = require('./usergroupsaccess');
const ua = require('./useraccess');
var router = Router();

//henter users fra slack. 
router.get("/users", function (request, response) {
  dataAccessLayer.GetUsers(function(userlist) {
    Object(userlist.members).forEach(function(element, key, _array) {
      if(element["id"] == "USLACKBOT" || element["is_bot"] == true) {
        
        //userlist.members.remove(element);
      } else {
        element["_deleted"] = element["deleted"];
        element["_updated"] = element["updated"];
        element["_id"] = element["id"];
      }
      
    })
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(userlist));
  })
});

router.get("/usergroups", function (request, response) {
  GetUsergroups(function(usergrouplist) {
      Object(usergrouplist.usergroups).forEach(function(element, key, _array) {
      var deleted;
      
      if(element["deleted_by"]) {
        deleted = true;
      } else {
        deleted = false;
      }   
      element["_deleted"] = deleted;
      element["_updated"] = element["date_update"];
      element["_id"] = element["id"];
    });
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(usergrouplist));
  });
});

router.post('/users', function(request, response) {   
    var users = request.post;
    // preserve newlines, etc - use valid JSON

    Object(users.users).forEach(function(element, key, _array) {
      if(element["_deleted"] || element["deleted"]) {
        console.log("Deactivate");
        // dataAccessLayer.deactivateUser(element);
      } else {
        dataAccessLayer.UpdateUser(element, function(new_user_id) {                  
      });
      }
      
    })
    response.end(JSON.stringify(request.post));

});

router.post('/usergroups', function(request, response) {   
    var usergroups = request.post;
    
    Object(usergroups).forEach(function(element, key, _array) {
      var channelid = "";
      if(element["_deleted"]) {
      //   dataAccessLayer.deactivateUser(element, function(user) {        
      //     response.end(JSON.stringify(request.post));
      // });
        console.log("deactivate");
        
      } else {
        var name = ShortenGroupName(element['slack-usergroup:name']);
        if(element['slack-usergroup:id'] > "") {
          UpdateUsergroup(element, function(group) {        
            console.log("UpdateUsergroup:" +group);
          });   
        } else {
          if(element['slack-usergroup:name'] != null) {
            CreateChannel(element, function(res) {
              
              CreateUserGroup(element, res.channel.id,function(group) {
                console.log("usergroupid: " +group);
              }); 
            });
            
            
          } else {
            console.log("Empty name" +element);
            console.log("null value detected. Skipping: " +element._id);
          }
          
          
        }
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