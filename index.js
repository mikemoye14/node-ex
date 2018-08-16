//load environment variables
require('dotenv').config();

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

// Routing
app.use(express.static(path.join(__dirname, 'app')));

mongoose.connect(process.env.DB_URI, () => {console.log('Connected to DB at: ' + process.env.DB_URI)}, { useNewUrlParser: true });
var db = mongoose.connection();

db.on('error', function (err){
	console.log('err');
});
      
require('models/orders.js');
var order = mongoose.model('orders', orderSchema);

server.listen(port, () => {
  console.log('Server listening at port %d', port);
}).on('connection', function(socket){
    //console.log('Connection established from: ' + socket.address().address + ' : ' + socket.address().port + ' - version: ' + socket.address().family);
});

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
		  socket.broadcast.emit('waitTime', data);
		});
		
		socket.on('arrivalNotification', function(data){
		  console.log('Sending Arrival Notification: ' + data);
		  socket.broadcast.emit('arrivalNotification', data);
		});
		
		socket.on('cancel', function(data){
		  console.log('Cancel Request Received: ' + data);
		  socket.broadcast.emit('cancel', data);
		  dispatch.emit('cancel', data);
		});

        socket.on("disconnected", function () {

        });

});
