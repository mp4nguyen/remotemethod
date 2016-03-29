/**
 * Created by phuongnguyen on 22/03/16.
 */
var Discover = require('node-discover');
var cluster = require('cluster');
const http = require('http');
var remoteMethod = new require('./index');
//var discovery = new require('./lib/discovery.js');

if(cluster.isMaster) {
    console.log('Master ' + process.pid + ' is online');
    // we create a HTTP server, but we do not use listen
    // that way, we have a socket.io server that doesn't accept connections
    var numWorkers = require('os').cpus().length;
    var workers = [];

    var dis = new remoteMethod.Discovery();
    dis.on('request',function(msg){
        console.log("Discovery = ",msg);
        for(var i in workers){
            workers[i].send(msg);
        }
    });

    /*

*/
    for(var i = 0; i < numWorkers; i++) {
        var worker = cluster.fork();
        workers.push(worker);
        // Receive messages from this worker and handle them in the master process.
        worker.on('message', function(msg) {
            console.log('Master ' + process.pid + ' received message from worker ' + this.pid + '.', msg);
        });

        // Send a message from the master process to the worker.
        worker.send({msgFromMaster: 'This is from master ' + process.pid + ' to worker ' + worker.pid + '.'});

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
        var res = new remoteMethod.Responder(msg);
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

/*
    var server = http.createServer(function (request, response) {

        console.log("worker.process.pid = " + process.pid + " has a request");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Hello World\n");
    });
    //var d = Discover();
    //d.demote(true);
    // Listen on port 8000, IP defaults to 127.0.0.1
    server.listen(8000);
*/
    // Put a friendly message on the terminal
    console.log("Server running at http://127.0.0.1:8000/   worker.process.pid = " + process.pid);
}
