// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
}).on('connection', function(socket){
    console.log('Connection established from: ' + socket.address().address + ' : ' + socket.address().port + ' - version: ' + socket.address().family);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var socket = require('socket.io')(server);

var nsp = socket.of('/dispatch');
nsp.on('connection', function(socket){
  console.log('someone connected to dispatch nsp');
});

socket.sockets.on('connection', function (socket) {

		
		socket.on('connect', function (data) {
                socket.emit('connect', 'Connected to Dispatch');
				console.log(data);
        });

        socket.on('order', function (data) {
                console.log('New Order: ' + data);
                socket.emit('order', 'Order Received');
        });

        socket.on("disconnect", function () {

        });

});
