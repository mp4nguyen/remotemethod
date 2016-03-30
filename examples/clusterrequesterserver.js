/**
 * Created by phuongnguyen on 22/03/16.
 */

var remoteMethod = require('./../index');
var clusterOptions = {};

clusterOptions.numberOfWorkers = 4;

var master = function(){
    console.log('I am a master...');
};

var worker = function(){
    console.log('I am a worker...');

    // Receive messages from the master process.
    var RequesterForCluster = remoteMethod.RequesterForCluster;
    var req = new RequesterForCluster();
    //Lets require/import the HTTP module
    var http = require('http');
    var id = 0;

    //Lets define a port we want to listen to
    const PORT=8080;

    //We need a function which handles requests and send response
    function handleRequest(request, response){

        console.log("sending a req at " + process.pid + "   id = " + id + "   request.url = " , request.url );
        id++
        req.send({type:'hello', para: {id:id,pid:process.pid,url:request.url}}, function(res){
            console.log(res);
        });

        response.end('It Works!! Path Hit: ' + request.url);

    }

    //Create a server
    var server = http.createServer(handleRequest);

    //Lets start our server
    server.listen(PORT, function(){
        //Callback triggered when server is successfully listening. Hurray!
        console.log("Server listening on: http://localhost:%s at " + process.pid , PORT);
    });
};

var cluster = new remoteMethod.ClusterRequester(clusterOptions,master,worker);


/*
var cluster = require('cluster');
var remoteMethod = require('./../index');


if(cluster.isMaster) {

    console.log('Master ' + process.pid + ' is online');
    var numWorkers = require('os').cpus().length;
    var workers = [];


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


} else {

    //Lets require/import the HTTP module
    var http = require('http');
    var id = 0;
    var req = new remoteMethod.Requester();


    //Lets define a port we want to listen to
    const PORT=8080;

    //We need a function which handles requests and send response
    function handleRequest(request, response){

        console.log("sending a req at " + process.pid + "   id = " + id + "   request.url = " , request.url );
        id++
        req.send({type:'hello', para: {id:id,pid:process.pid,url:request.url}}, function(res){
            console.log(res);
        });

        response.end('It Works!! Path Hit: ' + request.url);

    }

    //Create a server
    var server = http.createServer(handleRequest);

    //Lets start our server
    server.listen(PORT, function(){
        //Callback triggered when server is successfully listening. Hurray!
        console.log("Server listening on: http://localhost:%s at " + process.pid , PORT);
    });

}

*/