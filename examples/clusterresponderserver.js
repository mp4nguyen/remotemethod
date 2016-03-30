/**
 * Created by phuongnguyen on 30/03/16.
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
    var ResponderForCluster = remoteMethod.ResponderForCluster;
    var res = new ResponderForCluster();
    if(res){
        console.log('there is res................');
        res.on('hello', function(req, cb) {
            var account = req || {};
            console.log("worker.process.pid = " + process.pid,req);
            setTimeout(function(){
                cb("worker.process.pid = " + process.pid + " has a msg = " + req.toString() + " para = " + req.para.id)
            },100);
        });
    }

};

var cluster = new remoteMethod.ClusterResponder(clusterOptions,master,worker);

