# Remote Method

Remote method to help one node.js server call a method from another node.js server. 

Support to build node.js microservices.

It will automatically discover services in internal network.
 
It supports cluster and multiple servers.

## 1. Installation

    $ npm install remotemethod
    
    $ npm install https://github.com/mp4nguyen/remotemethod.git
     
## 2. Single thread call single thread

the source code is placed in example folder

requester server <-> responder servers

requester server: 
    - requesterserver.js

responder servers:
    - responderserver.js
    - responderserver2.js

### 2.1. Requester server

Requester server needs to make requests from 2 services that are in different servers

Let assume that there are 2 services : res1 and res2

One service can serve many service type.

In res1, has service type is 'hello'

In res2, has service type is 'hello2'


```js
var remoteMethod = require('RemoteMethod');
var req1 = new remoteMethod.Requester({serviceName:'res1'});
var req2 = new remoteMethod.Requester({serviceName:'res2'});
var id = 0;

setInterval(function(){
    id++;    
    req1.send({type:'hello', para: {id:id}}, function(res){
        console.log(res);
    });
    
    req2.send({type:'hello2', para: {id:id}}, function(res){
        console.log(res);
    });
        
}, 1000);
```


### 2.2. Responder server:

### 2.2.1 Responder server 1:

```js
var remoteMethod = require('RemoteMethod');
var Responder = remoteMethod.Responder;
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
```

### 2.2.2 Responder server 2:

```js
var remoteMethod = require('RemoteMethod');
var Responder = remoteMethod.Responder;
var res = new Responder({serviceName:'res2'});
if(res){
    res.on('hello2', function(req, cb) {
        var account = req || {};
        console.log("worker.process.pid = " + process.pid,req);
        setTimeout(function(){
            cb("worker.process.pid = " + process.pid + " has a msg = " + req.type + " para = " + req.para.id)
        },10);
    });
}
```

## 3. Cluster server

the source code is placed in example folder

send request server -> cluster requester server <-> cluster responder servers

send a request server: this is api consumer, will call the api from cluster requester server
    - 2sendrequestserver.js
    
cluster requester server: provide apis, and run on cluster with 4 workers. the api request will be distributed the workers automatically 
    - 2reqclusterserver.js

cluster responder servers: will process any request from cluster request server. ther are 2 services, and each service is processed each server.
Each server will has 4 workers to do the response 
    - 2resclusterserver.js
    - 2resclusterserver2.js
    
### 3.1 Requester server

```js
var remoteMethod = require('RemoteMethod');
var clusterOptions = {};

clusterOptions.numberOfWorkers = 4;

var master = function(workers){
    var RequestMaster = remoteMethod.RequesterMaster;
    var r1 = new RequestMaster({serviceName:'res1'},workers,8000);
    var r2 = new RequestMaster({serviceName:'res2'},workers,9000);
};

var worker = function(){        
    var RequesterWorker = remoteMethod.RequesterWorker;
    var req = new RequesterWorker({serviceName:'res1'});
    var req2 = new RequesterWorker({serviceName:'res2'});    
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
```

### 3.2. Responder server

```js
var remoteMethod = require('./../index');
var clusterOptions = {};

clusterOptions.numberOfWorkers = 4;

var master = function(workers){
    var ResponderMaster = remoteMethod.ResponderMaster;
    var req = new ResponderMaster({serviceName:'res1'},workers);
};

var worker = function(){
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
```

## Authors

  - Phuong Nguyen
  - mp4nguyen@gmail.com

## License

  MIT

Copyright (c) 2016-2016 Phuong Nguyen <mp4nguyen@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.   


