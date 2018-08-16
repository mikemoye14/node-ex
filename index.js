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
app.use(express.static(path.join(__dirname, './')))

//console.log(order.find());

server.listen(port, () => {
  console.log('Server listening at port %d', port);
}).on('connection', function(socket){
    //console.log('Connection established from: ' + socket.address().address + ' : ' + socket.address().port + ' - version: ' + socket.address().family);
})

mongoose.connect(
	process.env.DB_URI, { useNewUrlParser: true }, () => {console.log('Connecting to DB at: ' + process.env.DB_URI)}
)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB')
});

//create order schema
var Schema = mongoose.Schema;
 
var orderSchema = new Schema({
    "orderId" : String,
    "name" : String,
    "phone" : String,
    "pickup" : String,
    "destination" : String,
    "status" : String,
    "time" : Date
});

var order = mongoose.model('orders', orderSchema);

//create dummy data in db
order.create({
            orderId : '12345',
            name : 'test',
            phone : 7175555555,
            pickup : 'test',
            destination : 'test',
            status : 'Waiting',
            time : Date.now(),
}, function (err, orderId){
	if (err) console.log(err + '\n\nerror while trying to save order: ' + orderId);
	else console.log('Saved order: ' + orderId);
});

order.find({}, function(err, orders) {
  if (err) throw err;

  // object of all the users
  console.log(orders);
});

var socket = require('socket.io')(server);

var dispatch = socket.of('/dispatch');
dispatch.on('init', function(data){
  console.log(data);
});

socket.sockets.on('connection', function (socket) {
		
	socket.on('init', function (data) {

		//var orderData = order.find();

		socket.emit('init', data);
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
