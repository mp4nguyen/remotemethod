/**
 * Created by phuongnguyen on 22/03/16.
 */
var cluster = require('cluster');
var remoteMethod = require('./../index');
var req1 = new remoteMethod.Requester({serviceName:'res1'});
var req2 = new remoteMethod.Requester({serviceName:'res2'});
var id = 0;

/*
req.on('ready',function(req,cb){
//    console.log('ready = ',req);
});
*/

setInterval(function(){
    //sock.send('hello');
    id++;
    console.log("sending a req.");
    req1.send({type:'hello', para: {id:id}}, function(res){
        console.log(res);
    });

    req2.send({type:'hello2', para: {id:id}}, function(res){
        console.log(res);
    });

}, 1000);

