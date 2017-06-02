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
}


var dataAccessLayer = new DataAccessLayer();

var router = Router();

//henter users fra slack. 
router.get("/users", function (request, response) {
  dataAccessLayer.GetUsers(function(userlist) {
    Object.keys(userlist.members).forEach(function(element, key, _array) {
      userlist.members[element]["_deleted"] = userlist.members[element]["deleted"];
      userlist.members[element]["updated"] = userlist.members[element]["updated"];
      userlist.members[element]["_id"] = userlist.members[element]["id"];
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

router.post("/users", function (request, response) {
  
});

// Configure our HTTP server to use router function
var server = http.createServer(router);

// Listen on port 5000, IP defaults to 127.0.0.1
server.listen(port, host);

// Put a friendly message on the terminal
console.log("Server running at http://" +host +":" +port);