/**
 * Created by phuongnguyen on 30/03/16.
 */
var remoteMethod = require('./../../index');
var clusterOptions = {};

clusterOptions.numberOfWorkers = 4;

var master = function(workers){
    console.log('I am a master...');
    var ResponderMaster = remoteMethod.ResponderMaster;
    var req = new ResponderMaster({serviceName:'res1'},workers);
};

var worker = function(){
    console.log('I am a worker...');

    // Receive messages from the master process.
    var ResponderWorker = remoteMethod.ResponderWorker;
    var res = new ResponderWorker({serviceName:'res1'});
    res.on('hello', function(req, cb) {
        var account = req || {};
        console.log("worker.process.pid = " + process.pid,req);
        setTimeout(function(){
            cb("worker.process.pid = " + process.pid + " has a msg = " + req.type + " para = " + req.para.id)
        },100);
    });

};

var cluster = new remoteMethod.Cluster(clusterOptions,master,worker);

