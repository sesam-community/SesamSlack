// Load the http module to create an http server.
var http = require('http');
var Router = require('node-simple-router');
var url = require('url');

//variables
var host = "localhost";
var port = "5000";
var userlist;



function DataAccessLayer() {


  this.GetUsers = function (callback) {
    var WebClient = require('@slack/client').WebClient;

    var token = process.env.SLACK_TOKEN || '';
    var web = new WebClient("xoxp-178195654566-177394975970-189327793635-005d6247cfbe86059052312d9d1c1f9c");

    web.users.list(function teamInfoCb(err, info) {
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

// Configure router to respond with a list of entities to /entities
router.get("/entities", function (request, response) {
  var since = url.parse(request.url, true).query.since;
  console.log(userlist);
  dataAccessLayer.GetUsers(function(userlist) {
    console.log(userlist);
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(userlist));
  })
  
});

// Configure our HTTP server to use router function
var server = http.createServer(router);

// Listen on port 5000, IP defaults to 127.0.0.1
server.listen(port, host);

// Put a friendly message on the terminal
console.log("Server running at http://" +host +":" +port);