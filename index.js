/**
 * Created by phuongnguyen on 29/03/16.
 */
var Discovery = require('./lib/discovery.js'),
    Requester = require('./lib/requester.js'),
    Responder = require('./lib/responder.js');

//    TimeBalancedRequester = require('./lib/TimeBalancedRequester.js'),
//    PendingBalancedRequester = require('./lib/PendingBalancedRequester.js');

function cote(options) {
    /*
    var environment = options.environment || '';

    var components = [Requester, Responder, Publisher, Subscriber, Sockend, TimeBalancedRequester,
        PendingBalancedRequester];

    components.forEach(function(component) {
        component.setEnvironment(environment);
    });

    Discovery.setDefaults(options);
    */
    return cote;
}

cote.Requester = Requester;
cote.Responder = Responder;
cote.Discovery = Discovery;

/*
cote.Publisher = Publisher;
cote.Subscriber = Subscriber;
cote.Sockend = Sockend;
cote.Monitor = Monitor;
cote.TimeBalancedRequester = TimeBalancedRequester;
cote.PendingBalancedRequester = PendingBalancedRequester;
*/

module.exports = cote;

