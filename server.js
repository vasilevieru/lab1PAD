var net = require('net');
//var queue = require('queue');
var JsonSocket = require('json-socket');

//var q = queue();

// Keep track of the chat clients
var clients = [];
var results = [];

var port = 5000;

var server = net.createServer();
server.listen(port);

server.on('connection', function (socket) {

    socket = new JsonSocket(socket);

    // Put this new client in the list
    clients.push(socket);

    socket.on('message', function (message) {

        if (!message.command) {
            console.log(message.message);
            results.push(message.message.toString());
            console.log(results);
        } else if (message.command) {
            console.log(message.command);
            socket.sendMessage({"sms": results.shift()});
        }
    });

    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        console.log("Disconnected\n");
    });
});

console.log("Server running at 127.0.0.1:5000");