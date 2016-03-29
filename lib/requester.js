/**
 * Created by phuongnguyen on 23/03/16.
 */
var axon = require('axon');
var portfinder = require('portfinder');
var Discover = require('node-discover');
var d = Discover();
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');

var Requester = function() {
    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    var that = this;
    console.log("requester is starting...");
    portfinder.getPort( function(err, port) {
        console.log(" portfider = " + port);
        that.sock = new axon.ReqSocket();
        that.sock.bind(port);
        console.log('request server started');
        that.emit('ready', that.sock);

        var d = Discover();
        d.advertise({type:'request' , port:port});
        d.on("promotion", function () {
            console.log("I was promoted to a master.");
        });

        d.on("demotion", function () {
            console.log("I was demoted from being a master.");
        });

        d.on("added", function (obj) {
            console.log("A new node has been added.",obj);
        });

        d.on("removed", function (obj) {
            console.log("A node has been removed.",obj);
        });

        d.on("master", function (obj) {
            console.log("A new master is in control",obj);
        });
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

