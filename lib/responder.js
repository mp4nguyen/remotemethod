/**
 * Created by phuongnguyen on 24/03/16.
 */
var axon = require('axon');
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');

var Responder = function(resInfo){
    var info = resInfo||{};
    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    console.log("Responder is running... at " + process.pid);

    var that = this;
    var discovery = require('./discovery.js');
    //start discovery with type and service name to notify everyone know that the response is ready to serve.
    var dis = new discovery({type:'response',serviceName:info.serviceName});
    dis.on('request',function(msg){
        console.log("Discovery = ",msg);
        var obj = msg;
        if(obj.advertisement){
            console.log('--->',obj,"   my service = ",info.serviceName);
            ///check whether has a request and the request service is the same response service
            /// If yes, open the axon on the same port and start to listen the request
            if(obj.advertisement.type == 'request' && obj.advertisement.serviceName == info.serviceName){
                console.log('---> will open axon on ' + obj.advertisement.port + ' for service' + info.serviceName);
                var sock = axon.socket('rep');
                sock.connect(obj.advertisement.port,obj.address);
                sock.on('message', function(req, cb){
                    console.log('---> received a message type = ',req.type);
                    that.emit(req.type,req,cb);
                });
            }
        }
    });

}

util.inherits(Responder, EventEmitter);


module.exports = Responder;
