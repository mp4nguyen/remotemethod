/**
 * Created by phuongnguyen on 22/03/16.
 */

var remoteMethod = require('./../../index');

var Responder = remoteMethod.Responder; //require('../lib/responder');
var res = new Responder({serviceName:'res1'});
if(res){
    res.on('hello', function(req, cb) {
        var account = req || {};
        console.log("worker.process.pid = " + process.pid,req);
        setTimeout(function(){
            cb("worker.process.pid = " + process.pid + " has a msg = " + req.type + " para = " + req.para.id)
        },10);
    });
}


