/**
 * Created by phuongnguyen on 30/03/16.
 */
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');


var ResponderMaster = function(resInfo,workers){

    var that = this;
    var info = resInfo || {};

    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    var discovery = require('./discovery.js');
    var dis = new discovery({type:'response',serviceName:info.serviceName});
    dis.on('request',function(msg){
        msg.masterType = 'Response';
        console.log("Discovery = ",msg);
        if(info.serviceName == msg.advertisement.serviceName){
            for(var i in workers){
                console.log('send message to worker ' + i);
                workers[i].send(msg);
            }
        }
    });
}

util.inherits(ResponderMaster, EventEmitter);

module.exports = ResponderMaster;

