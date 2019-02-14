var webSocketServer = require('websocket').server;
var http = require('http');

var history = [];
var clients = [];
var webSocketsServerPort = 1337;
var server = http.createServer(function(request, response) {

});

server.listen(webSocketsServerPort, function() {
    console.log(new Date() + " Server is listening on port:" + webSocketsServerPort)
});

wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log(new Date() + " Connection from origin " + request.origin)
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        var userObject = {type:'message', data:JSON.parse(message.utf8Data)};
        if(userObject.data.history == false)
        {
            // history.foreach(function(element) {

            // })
            var json = JSON.stringify(history);
            clients[index].sendUTF(json);
        }
        else
        {
            console.log((new Date()) + ' Received Message from ' + userObject.data.userName + ': ' + userObject.data.message);
            history.push(userObject);
            // if(message.type=='utf8') {
            //     console.log(message);
            //     console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data);
            //     //process wS msg
            // }
            var json = JSON.stringify([history[history.length-1]]);
            for (var i=0; i < clients.length; i++) {
              clients[i].sendUTF(json);
            }
        }
        
    });

    connection.on('close', function(connection) {
        clients.splice(index, 1);
        console.log(new Date() + " Connection from " + connection.remoteAddress + " disconnected")
    });
});