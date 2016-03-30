/**
 * Created by phuongnguyen on 29/03/16.
 */
var
    Requester = require('./lib/requester.js'),
    Responder = require('./lib/responder.js'),
    ClusterResponder = require('./lib/clusterresponder.js'),
    ResponderForCluster = require('./lib/responderforcluster.js'),
    Discovery = require('./lib/discovery.js');

//    TimeBalancedRequester = require('./lib/TimeBalancedRequester.js'),
//    PendingBalancedRequester = require('./lib/PendingBalancedRequester.js');

var remoteMethod = {};

remoteMethod.Requester = Requester;
remoteMethod.Responder = Responder;
remoteMethod.Discovery = Discovery;
remoteMethod.ClusterResponder = ClusterResponder;
remoteMethod.ResponderForCluster = ResponderForCluster;

module.exports = remoteMethod;

