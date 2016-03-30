/**
 * Created by phuongnguyen on 30/03/16.
 */
var EventEmitter = require('eventemitter2').EventEmitter2,
    util = require('util');
var cluster = require('cluster');
var portfinder = require('portfinder');

var ClusterRequest = function(clusterOptions,masterFunc,workerFunc){

    var that = this;
    this.res;
    var options = clusterOptions || {};
    var masterFunction = masterFunc || function(){};
    var workerFunction = workerFunc || function(){};

    EventEmitter.call(this, {
        wildcard: true, // should the event emitter use wildcards.
        delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
        newListener: false, // if you want to emit the newListener event set to true.
        maxListeners: 2000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    if(cluster.isMaster) {

        console.log('Master ' + process.pid + ' is online');
        var numWorkers = options.numberOfWorkers || require('os').cpus().length;
        var workers = [];

        //Find available port at master and use this port on axon and send this port to responders
        portfinder.getPort( function(err, port) {
            console.log(" portfider = " + port);
            var discovery = require('./discovery.js');
            var dis = new discovery({type:'request',port:port});
            ///send port number to workers , so they can create the axon instance
            for(var i in workers){
                workers[i].send({port:port});
            }
        });

        for(var i = 0; i < numWorkers; i++) {
            var worker = cluster.fork();
            workers.push(worker);
            // Receive messages from this worker and handle them in the master process.
            worker.on('message', function(msg) {
                console.log('Master ' + process.pid + ' received message from worker ' + this.pid + '.', msg);
            });
        }

        cluster.on('online', function(worker) {
            console.log('Worker ' + worker.process.pid + ' is online');

        });

        cluster.on('exit', function(worker, code, signal) {
            console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('Starting a new worker');
            cluster.fork();
        });

        masterFunction();

    } else {

        console.log("Server running at worker.process.pid = " + process.pid);
        workerFunction();
    }

    return this;
}

util.inherits(ClusterRequest, EventEmitter);

module.exports = ClusterRequest;

