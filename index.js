// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
}).on('connection', function(socket){
    //console.log('Connection established from: ' + socket.address().address + ' : ' + socket.address().port + ' - version: ' + socket.address().family);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var socket = require('socket.io')(server);

var dispatch = socket.of('/dispatch');
dispatch.on('init', function(data){
  console.log(data);
});

socket.sockets.on('connection', function (socket) {
		
		socket.on('init', function (data) {
                socket.emit('init', 'Connected to Dispatch');
				console.log(data);
        });

        socket.on('order', function (data) {
                console.log('New Order: ' + data);
                socket.emit('order', 'Order Received');
				dispatch.emit('order', data);
        });
		
		socket.on('waitTime', function(data){
		  console.log(data);
		  socket.broadcast.emit('watTime', data);
		});

        socket.on("disconnected", function () {

        });

});
