/**
 * Created by phuongnguyen on 23/03/16.
 */
/**
 * Created by phuongnguyen on 24/03/16.
 */
var Discover = require('node-discover');
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');

var Discovery = function(adv){

    console.log('discover is running... at ' + process.pid);
    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    var d = Discover();
    var that = this;
    d.advertise(adv);
    d.on("promotion", function () {
        console.log("I was promoted to a master.");
    });

    d.on("demotion", function () {
        console.log("I was demoted from being a master.");
    });

    d.on("added", function (obj) {
        console.log("A new node has been added.",obj);
        var adv = obj.advertisement;
        if(adv){
            console.log('--->',adv);
            if(adv.type == 'request'){
                that.emit('request',obj);
            }
        }
    });

    d.on("removed", function (obj) {
        console.log("A node has been removed.",obj);
    });

    d.on("master", function (obj) {
        /*
         * A new master process has been selected
         *
         * Things we might want to do:
         *   - Review what the new master is advertising use its services
         *   - Kill all connections to the old master
         */

        //console.log("A new master is in control",obj);
    });

}

util.inherits(Discovery, EventEmitter);


module.exports = Discovery;
