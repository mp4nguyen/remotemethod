/**
 * Created by phuongnguyen on 26/03/16.
 */
var Discover = require('node-discover');
const http = require('http');

var d = Discover();
var that = this;
//d.advertise({type:'response'});
d.on("promotion", function () {
    console.log("I was promoted to a master.");
});

d.on("demotion", function () {
    console.log("I was demoted from being a master.");
});

d.on("added", function (obj) {
    console.log("A new node has been added.",obj);
});

d.on("removed", function (obj) {
    console.log("A node has been removed.",obj);
});

d.on("master", function (obj) {
    /*
     * A new master process has been selected
     *
     * Things we might want to do:
     *   - Review what the new master is advertising use its services
     *   - Kill all connections to the old master
     */

    console.log("A new master is in control",obj);
});


var server = http.createServer(function (request, response) {

    console.log("worker.process.pid = " + process.pid + " has a request");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World\n");
});
//var d = Discover();
//d.demote(true);
// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);
