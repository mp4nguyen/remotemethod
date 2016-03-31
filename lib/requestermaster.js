/**
 * Created by phuongnguyen on 30/03/16.
 */
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');
var portfinder = require('portfinder');

var RequestMaster = function(reqInfo,workers,portStartFrom){

    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    var info = reqInfo || {};

    //Find available port at master and use this port on axon and send this port to responders
    portfinder.basePort = portStartFrom;
    portfinder.getPort( function(err, port) {
        console.log(" portfider = " + port + " for service " + info.serviceName);
        var discovery = require('./discovery.js');
        var dis = new discovery({type:'request',port:port,serviceName:info.serviceName});
        ///send port number to workers , so they can create the axon instance
        for(var i in workers){
            workers[i].send({type:'request',port:port,serviceName:info.serviceName});
        }
    });

}

util.inherits(RequestMaster, EventEmitter);

module.exports = RequestMaster;

