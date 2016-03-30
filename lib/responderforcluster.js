/**
 * Created by phuongnguyen on 24/03/16.
 */
var axon = require('axon');
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');

var ResponderForCluster = function(obj){

    var that = this;
    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });
    // Receive messages from the master process.
    process.on('message', function(msg) {

        console.log('Responder Worker is running at ' + process.pid + ' received message from master.', msg);

        var obj = msg;
        if(obj.advertisement){
            console.log('--->',obj);
            if(obj.advertisement.type == 'request'){
                console.log('---> will open axon on ',obj.advertisement.port);
                var sock = axon.socket('rep');
                sock.connect(obj.advertisement.port,obj.address);
                sock.on('message', function(req, cb){
                    console.log('---> received a message ',req);
                    that.emit(req.type,req,cb);
                });
            }
        }

    });
}

util.inherits(ResponderForCluster, EventEmitter);


module.exports = ResponderForCluster;
