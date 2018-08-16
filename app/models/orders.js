var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
 
var orderSchema = mongoose.Schema({
    "id" : String,
    "name" : String,
    "phone" : String,
    "pickup" : String,
    "destination" : String,
    "status" : String,
    "time" : Date
});
 
module.exports = mongoose.model('order', orderSchema);
