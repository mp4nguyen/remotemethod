/**
 * Created by phuongnguyen on 30/03/16.
 */
var request = require('request');
var id = 0;
setInterval(function(){
    //sock.send('hello');
    id++;
    request('http://localhost:8080/' + id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage.
        }
    })

}, 10);


