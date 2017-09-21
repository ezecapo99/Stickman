var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io =  require('socket.io').listen(server);
var clear = require('clear');
var colors = require('colors');
var figlet = require('figlet');
var shortId 		= require('shortid');
var log = require('single-line-log').stdout;




app.set ('port', process.env.PORT || 3000 );
server.listen(3000, 'localhost');
var clients = [];
var connectionCounter = 0;
io.on('connection', function (socket) {
	
	var currentUser;
   connectionCounter++;
	socket.on('USER_CONNECT', function (){
		for (var i = 0; i < clients.length; i++) {
			socket.emit('USER_CONNECTED',{
              
				name:clients[i].name,
				id:clients[i].id,
				position:clients[i].position

			});

		};
    	
	});

	socket.on('PLAY', function (data){
		console.log(data)
		currentUser = {
			name:data.name,
			id:shortId.generate(),
			position:data.position
		}

		clients.push(currentUser);
		socket.emit('PLAY',currentUser );
		socket.broadcast.emit('USER_CONNECTED',currentUser);

	});


	socket.on('disconnect', function (){
         connectionCounter--;
		socket.broadcast.emit('USER_DISCONNECTED',currentUser);
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].name === currentUser.name && clients[i].id === currentUser.id) {

				console.log("User "+clients[i].name+" id: "+clients[i].id+" has disconnected\n");
				clients.splice(i,1);
       
			};
		};
log("Users Connected ".cyan+connectionCounter+'\n');
	});

	socket.on('MOVE', function (data){

		// currentUser.name = data.name;
		// currentUser.id   = data.id;
		currentUser.position = data.position;

		socket.broadcast.emit('MOVE', currentUser);
		log(currentUser.name.bgYellow+" Move to "+currentUser.position.bgGreen+'\n');
        

	});
log("Users Connected ".cyan+connectionCounter+'\n');
});


server.listen(app.get('port'), function(){
    clear();
	console.log("------------------- SERVER IS RUNNIG ------------------- ".green);
figlet('STICKMAN', function(err, ascii) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(ascii)
    console.log("Stop server: ctrl + c".green);
});
});
