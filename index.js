/**
 * Created by phuongnguyen on 29/03/16.
 */
var
    Requester = require('./lib/requester.js'),
    Responder = require('./lib/responder.js'),
    ClusterResponder = require('./lib/clusterresponder.js'),
    ClusterRequester = require('./lib/clusterrequest.js'),
    ResponderForCluster = require('./lib/responderforcluster.js'),
    RequesterForCluster = require('./lib/requesterforcluster.js'),
    Discovery = require('./lib/discovery.js');

    Cluster = require('./lib/cluster.js');

    RequesterMaster = require('./lib/requestermaster.js');
    RequesterWorker = require('./lib/requesterworker.js');

    ResponderMaster = require('./lib/respondermaster.js');
    ResponderWorker = require('./lib/responderworker.js');


//    TimeBalancedRequester = require('./lib/TimeBalancedRequester.js'),
//    PendingBalancedRequester = require('./lib/PendingBalancedRequester.js');

var remoteMethod = {};

remoteMethod.Requester = Requester;
remoteMethod.Responder = Responder;
remoteMethod.Discovery = Discovery;
remoteMethod.ClusterResponder = ClusterResponder;
remoteMethod.ResponderForCluster = ResponderForCluster;
remoteMethod.RequesterForCluster = RequesterForCluster;
remoteMethod.ClusterRequester = ClusterRequester;

remoteMethod.Cluster = Cluster;

remoteMethod.RequesterMaster = RequesterMaster;
remoteMethod.RequesterWorker = RequesterWorker;

remoteMethod.ResponderMaster = ResponderMaster;
remoteMethod.ResponderWorker = ResponderWorker;


module.exports = remoteMethod;

