
var http = require('http');
var url = require('url');
var host = "0.0.0.0";
var port = 5000;
var userGroups = require('./usergroups');
var users = require('./users');


var handle = {};
handle['/users'] = users.user;
handle['/usergroups'] = userGroups.usergroup; 


start(route, handle);
function start(route, handle) {
  function onRequest(request, response) {
    var pathName = url.parse(request.url).pathname;
    console.log( request.method + ' Request for ' + pathName + ' received.');
    route(handle, pathName, response, request);
  }
  
  http.createServer(onRequest).listen(port);
  console.log("Server running at http://" +host +":" +port);
}


function route(handle, pathname, response, request) {
console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    return handle[pathname](request,response);
  } else {
    console.log('No request handler found for ' + pathname);
    response.writeHead(404 ,{'Content-Type': 'text/plain'});
    response.write('404 Not Found');
    response.end();
  }
}


