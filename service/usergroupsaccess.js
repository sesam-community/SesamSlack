var http = require('http');
var Router = require('node-simple-router');
var url = require('url');
var WebClient = require('@slack/client').WebClient;
var token = process.env.slacktoken;
var web = new WebClient(token);

GetUsergroups = function (callback) {
    web.usergroups.list(function teamInfoCb(err, info) {
        if (err) {
            console.log('Error:', err);
        } else {        
            return callback(info);
        }
    });
};  

UpdateUsergroup = function (group) {

};

CheckUserGroup = function (group) {

};


ShortenGroupName = function (name) {
    var shortname = "";
    var regions = ["Stavanger", "Rogaland", "Øst", "Trondheim"];
    var shortword = {prosjektledelse:"Pl", microsoft:"MS", rådgivning:"Råd", brukeropplevelse:"BO", administrasjon:"Admin", teknologi:"Tek", og:"&"};

    var splitname = name.split(" ");
    if(regions.indexOf(splitname[0]) != -1) {
        shortname = splitname[0].substring(0,3);
    } else {
        shortname = splitname[0];
    }
    for (i = 1; i < splitname.length; i++) {
        shortname += " ";
        if(splitname[i].toLowerCase() in shortword) {
        shortname += shortword[splitname[i].toLowerCase()];
        } else {
        shortname += splitname[i];
        }
    }
    return shortname.substring(0,21);
};

CreateChannel = function (channel, callback) {
    var channelname = channel["slack-usergroup:name"];
    var name = ShortenGroupName(channelname);
    web.channels.create(name, function(err, response) {
        if (err) {
        console.log("Err: " +err);
        } else {
        console.log("channel created: " +name);
        return callback(response);
        }
    })
};

CreateUserGroup = function (group, channel, callback) {
    var groupname = group["slack-usergroup:name"];
    var opts = {};
    opts.channels = channel;
    web.usergroups.create(groupname, opts , function (err, response){
        if (err) {
            console.log("Err: " +err);
        } else {
            return callback(response);
        }
    });
};
