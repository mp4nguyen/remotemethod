/**
 * Created by phuongnguyen on 22/03/16.
 */
var cluster = require('cluster');
var remoteMethod = require('./../index');


if(cluster.isMaster) {

    console.log('Master ' + process.pid + ' is online');
    var numWorkers = require('os').cpus().length;
    var workers = [];

    var discovery = remoteMethod.Discovery;
    var dis = new discovery();
    dis.on('request',function(msg){
        console.log("Discovery = ",msg);
        for(var i in workers){
            workers[i].send(msg);
        }
    });

    for(var i = 0; i < numWorkers; i++) {
        var worker = cluster.fork();
        workers.push(worker);
        // Receive messages from this worker and handle them in the master process.
        worker.on('message', function(msg) {
            console.log('Master ' + process.pid + ' received message from worker ' + this.pid + '.', msg);
        });

        // Send a message from the master process to the worker.
        //worker.send({msgFromMaster: 'This is from master ' + process.pid + ' to worker ' + worker.pid + '.'});

    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');

    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

} else {

    // Send message to master process.
    process.send({msgFromWorker: 'This is from worker ' + process.pid + '.'})

    // Receive messages from the master process.
    process.on('message', function(msg) {
        console.log('Worker ' + process.pid + ' received message from master.', msg);

        var Responder = remoteMethod.Responder; //require('../lib/responder');
        var res = new Responder(msg);
        if(res){
            res.on('hello', function(req, cb) {
                var account = req || {};
                console.log("worker.process.pid = " + process.pid,req);
                setTimeout(function(){
                    cb("worker.process.pid = " + process.pid + " has a msg = " + req.toString() + " para = " + req.para.id)
                },2000);


            });
        }
    });


    console.log("Server running at worker.process.pid = " + process.pid);
}
