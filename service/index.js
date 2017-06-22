var server = require('./server');
var userGroups = require('./userGroups');
var router = require('./router');
var users = require('./users');

//Håndtere flere metoder fra users
var handle = {};
handle['/users'] = users.user;
//handle['/invite'] = users.inviteUser;
handle['/userGroups'] = userGroups.getUsergroups;
//handle['/updateUsergroup'] = userGroups.updateUsergroup;
//handle['/createChannel'] = userGroups.createChannel;

server.start(router.route, handle);
