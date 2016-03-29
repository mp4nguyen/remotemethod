/**
 * Created by phuongnguyen on 22/03/16.
 */
var cluster = require('cluster');
var remoteMethod = require('./index');
var req = new remoteMethod.Requester();
var id = 0;

req.on('ready',function(req,cb){
    console.log('ready = ',req);
});

setInterval(function(){
    //sock.send('hello');
    id++;
    console.log("sending a req.");
    req.send({type:'hello', para: {id:id}}, function(res){
        console.log(res);
    });
}, 1000);


