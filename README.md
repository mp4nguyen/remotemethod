# Remote Method

Remote method to help one node.js server call a method from another node.js server. 

Support to build node.js microservices.

It will automatically discover services in internal network.
 
It supports cluster and multiple servers.
 
For example: 
  
  - Server1.js is responder, it will listen other requester server and response. The server1 is cluster server. It also can run on other servers
  
  - Server2.js is requester, will send the requests to responder servers. it will automatically distribute the requests to the responders(on workers of cluster and on servers).
  
  Run server1.js on 2 machines in the same internal network, each machine will have the number of workers depend on the number of cpu of that machine.
   
  For example: each machine has 4 cpus, so we will have 8 workers to look after the requests
   
  Can add more responders for scaling.
   
   


