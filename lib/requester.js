/**
 * Created by phuongnguyen on 23/03/16.
 */
var axon = require('axon');
var portfinder = require('portfinder');
var Discover = require('node-discover');
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');

var Requester = function(reqInfo) {
    var info = reqInfo||{};
    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    var that = this;
    console.log("requester is starting... at" + process.pid);
    portfinder.getPort( function(err, port) {
        console.log(" portfider = " + port + " for service " + info.serviceName);
        that.sock = new axon.ReqSocket();
        that.sock.bind(port);
        that.emit('ready', that.sock);

        var discovery = require('./discovery.js');
        //find the response that provide the service name
        var dis = new discovery({type:'request',port:port,serviceName:info.serviceName});

    });

    this.send = function(){
        console.log("prototype send...");
        var args = Array.prototype.slice.call(arguments);
        console.log(arguments , args);
        this.sock && this.sock.send.apply(this.sock, args);
    };

    return this;
};

util.inherits(Requester, EventEmitter);


module.exports = Requester;

