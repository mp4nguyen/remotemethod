/**
 * Created by phuongnguyen on 30/03/16.
 */
var remoteMethod = require('./../../index');
var clusterOptions = {};

clusterOptions.numberOfWorkers = 4;

var master = function(workers){
    console.log('I am a master...');
    var RequestMaster = remoteMethod.RequesterMaster;
    var r1 = new RequestMaster({serviceName:'res1'},workers,8000);
    var r2 = new RequestMaster({serviceName:'res2'},workers,9000);
};

var worker = function(){
    console.log('I am a worker...');
    // Receive messages from the master process.
    var RequesterWorker = remoteMethod.RequesterWorker;
    var req = new RequesterWorker({serviceName:'res1'});
    var req2 = new RequesterWorker({serviceName:'res2'});
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

        req2.send({type:'hello2', para: {id:id,pid:process.pid,url:request.url}}, function(res){
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

var cluster = new remoteMethod.Cluster(clusterOptions,master,worker);

