var net = require('net');
var fs = require('fs');
var JsonSocket = require('json-socket');

// Keep track of the chat clients
var clients = [];
var results = [];

var port = 5000;

var server = net.createServer();
server.listen(port);

var json = JSON.parse(fs.readFileSync('/home/vasile/IdeaProjects/broker/broker', 'utf8'));

console.log(json);

console.log("coada");
for (var i = 0; i < json.length; i++) {
    results.push(json[i]);
}
console.log("Read successfully!");
console.log(results);

server.on('connection', function (socket) {

    socket = new JsonSocket(socket);

    // Put this new client in the list
    clients.push(socket);

    socket.on('message', function (message) {

        if (!message.command) {
            results.push(message);
            fs.writeFile("/home/vasile/IdeaProjects/broker/broker", JSON.stringify(results), function (err) {
                if (err) {
                    console.log(err.toString());
                }
                console.log("Message written with succes!");
            });
            console.log(message);
            console.log(results);
        } else if (message.command) {
            console.log(message.command);
            if (results.length > 0) {
                socket.sendMessage({"sms": results.shift()});
            } else {
                socket.sendMessage({"sms": "no messages in queue"});
            }
        }
    });

    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        console.log("Disconnected\n");
    });
});

console.log("Server running at 127.0.0.1:5000");