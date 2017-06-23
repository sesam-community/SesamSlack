
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

<<<<<<< HEAD
<<<<<<< HEAD
exports.start = start;
=======

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
      
    
    var usergroups =  JSON.parse( JSON.stringify( request.post ) );
    
    Object(usergroups).forEach(function(element, key, _array) {
      var channelid = "";
      if(element["_deleted"]) {
      //   dataAccessLayer.deactivateUser(element, function(user) {        
      //     response.end(JSON.stringify(request.post));
      // });
        console.log("deactivate");
        
      } else {
        var name = ShortenGroupName(element['name']);
        if(element['id'] > "") {
          
          
          (element, function(group) {        
            console.log("UpdateUsergroup:" +group);
          });   
        } else {
          if(element['name'] != null) {
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
>>>>>>> 69dd8a460787d396c351f04b464006014d1e742d
=======

>>>>>>> test
