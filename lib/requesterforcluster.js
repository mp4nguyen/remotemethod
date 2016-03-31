/**
 * Created by phuongnguyen on 23/03/16.
 */
var axon = require('axon');
var portfinder = require('portfinder');
var Discover = require('node-discover');
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');

var RequesterForCluster = function(reqInfo) {
    var info = reqInfo||{};
    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    var that = this;
    console.log("requester is starting... at" + process.pid);

    //Send the service name that the request need to the master, so the master can broadcast to everyone know
    process.send({type:'request',serviceName:info.serviceName});
    // Receive port from the master process.
    process.on('message', function(msg) {
        console.log('Requester Worker is running at ' + process.pid + ' received message from master.', msg);
        //create an instance of axon with port that master sent
        that.sock = new axon.ReqSocket();
        that.sock.bind(msg.port);
    });

    this.send = function(){
        var args = Array.prototype.slice.call(arguments);
        console.log(arguments , args);
        this.sock && this.sock.send.apply(this.sock, args);
    };

    return this;
};

util.inherits(RequesterForCluster, EventEmitter);


module.exports = RequesterForCluster;
