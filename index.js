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

app.get('/taxi', function (req, res) {
  res.sendFile('./index.html');
})

//init socket server
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

//connect to DB
mongoose.connect(
	process.env.DB_URI, { useNewUrlParser: true }, () => {console.log('Connecting to DB at: ' + process.env.DB_URI)}
);

//init DB
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
    "orderTime" : String
});

//init order model
var order = mongoose.model('orders', orderSchema);

/*
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

  // object of all the orders
  console.log(orders);
});
*/

//init socket
var socket = require('socket.io')(server);

//create dispatch socket channel
var dispatch = socket.of('/dispatch');

socket.sockets.on('connection', function (socket) {
		
	socket.on('start', function (data) {

		socket.emit('start', data);
			console.log(data);
	});
	
	socket.on('initDispatch', function(id){
	
	console.log('Connection established from Dispatch: ' + id);
		
		
	orders = order.find({status: 'Waiting', status: 'Dispatched'}, function(err, orders) {
			  if (err) throw err;

			  // object of all the orders
				console.log(orders);
				dispatch.emit('start', orders);
			});
			
	//orders = order.find({}, function(err, orders) {
	//		  if (err) throw err;
	//
	//		  // object of all the orders
	//			console.log(orders);
	//			dispatch.emit('start', orders);
	//		});
	
  //console.log(data);
});

        socket.on('order', function (data) {
		
		order.create({
					
				orderId : 		data.orderId,
				name : 			data.name,
				phone : 		data.phone,
				pickup : 		data.pickup,
				destination :		data.destination,
				status : 		'Waiting',
				orderTime : 		data.orderTime,

		}, function (err, orderId){
			if (err) console.log(err + '\n\nerror while trying to save order: ' + orderId);
			else console.log('Saved order: ' + orderId);
		});
		
                console.log('New Order: ' + data);
                socket.emit('order', 'Order Received');
				dispatch.emit('order', data);
        });
		
		socket.on('waitTime', function(data){
		  console.log(data);
			order.updateOne({orderId: data.id}, {$set: { status: "Dispatched" }}, function(err, res) {
    				if (err) throw err;				
			});
		  socket.broadcast.emit('waitTime', data);
		});
		
		socket.on('arrivalNotification', function(id){
		  console.log('Sending Arrival Notification: ' + id);
		  socket.broadcast.emit('arrivalNotification', id);
			order.updateOne({orderId: id}, {$set: { status: "Complete" }}, function(err, res) {
    				if (err) throw err;				
			});
		});
	
	socket.on('dispatchCancel', function(id){
		  console.log('Dispatch Cancel Request Received for: ' + id);
			
			order.updateOne({orderId: id}, {$set: { status: "Cancelled" }}, function(err, res) {
    				if (err) throw err;				
			});	
			 
			
		  socket.broadcast.emit('cancel', id);
		});
		
		socket.on('custCancel', function(id){
		  console.log('Cancel Request Received: ' + id);
			
			order.updateOne({orderId: id}, {$set: { status: "Cancelled" }}, function(err, res) {
    				if (err) throw err;				
			});	
		  dispatch.emit('cancel', id);
		});

        socket.on("disconnected", function () {

        });

});
