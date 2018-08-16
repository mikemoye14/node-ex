
var orderModel = require('../models/orderModel.js');
 
/**
 * orderController.js
 *
 * @description :: Server-side logic for managing orders.
 */
module.exports = {
 
    /**
     * orderController.list()
     */
    list: function(req, res) {
        orderModel.find(function(err, orders){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting order.'
                });
            }
            return res.json(orders);
        });
    },
 
    /**
     * orderController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        orderModel.findOne({_id: id}, function(err, order){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting order.'
                });
            }
            if(!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }
            return res.json(order);
        });
    },
 
    /**
     * orderController.create()
     */
    create: function(req, res) {
        var order = new orderModel({
            id : req.body.id,
            name : req.body.name,
            phone : req.body.phone,
            pickup : req.body.pickup,
            destination : req.body.destination,
            status : req.body.status,
            time : req.body.time,
        });
 
        order.save(function(err, order){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving order',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: order._id
            });
        });
    },
 
    /**
     * orderController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        orderModel.findOne({_id: id}, function(err, order){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving order',
                    error: err
                });
            }
            if(!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }
 
            order.id          =  req.body.id          ? req.body.id           : order.id;
            order.name        =  req.body.name        ? req.body.name         : order.name;
            order.phone       =  req.body.phone       ? req.body.phone        : order.id;
            order.pickup      =  req.body.pickup      ? req.body.pickup       : order.pickup;
            order.destination =  req.body.destination ? req.body.destination  : order.destination;
            order.status      =  req.body.status      ? req.body.status       : order.status;
            order.time        =  req.body.time        ? req.body.time         : order.time;
            
            order.save(function(err, order){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting order.'
                    });
                }
                if(!order) {
                    return res.status(404).json({
                        message: 'No such order'
                    });
                }
                return res.json(order);
            });
        });
    },
 
    /**
     * orderController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        orderModel.findByIdAndRemove(id, function(err, order){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting order.'
                });
            }
            return res.json(order);
        });
    }
};
