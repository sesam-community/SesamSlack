var http = require('http');
var Router = require('node-simple-router');
var url = require('url');
var WebClient = require('@slack/client').WebClient;
var token = process.env.slacktoken;
var web = new WebClient(token);
  
  GetUsers = function (callback) {
    web.users.list(function teamInfoCb(err, info) {
      if (err) {
        console.log('Error:', err);
      } else {        
        return callback(info);
      }
    });
  };

  UpdateUser = function (user, callback) {
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

SlackProfile = function (user) {
    var userprofile = {};        
    userprofile["user"] = user["_id"].split(":")[1];  

    var slackprofile = {};    
    slackprofile["first_name"] = (user["slack-profile:first_name"].toString().length > 0 ? user["slack-profile:first_name"].toString() : "" );
    slackprofile["last_name"] = (user["slack-profile:last_name"].toString().length > 0 ? user["slack-profile:last_name"].toString() : "");
    
    userprofile["profile"] =  slackprofile;
    return userprofile;
};

deactivateUser = function (user, callback) {
    web.makeAPICall('users.admin.setInactive', user["user"],  function (err, user) {
        if (err) {
          console.log("Err: " +err);
        } else {        
            console.log("Worx: " +user);
            return callback(user);
        }
    })
};

