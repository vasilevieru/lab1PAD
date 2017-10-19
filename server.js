var net = require('net');
var fs = require('fs');
var JsonSocket = require('json-socket');

// Keep track of the chat clients
var clients = [];
var object = new Object([]);
var port = 5000;

var server = net.createServer();
server.listen(port);

const stats = fs.statSync("broker");
const fileSizeInBytes = stats.size;
var flag=0;

if (fileSizeInBytes !== 0) {
    var json = JSON.parse(fs.readFileSync('/home/vasile/IdeaProjects/broker/broker', 'utf8'));

    for (var i = 0; i < json.length; i++) {
        object.push(json[i]);
    }
    console.log("Read successfully!");
}

server.on('connection', function (socket) {

    socket = new JsonSocket(socket);

    // Put this new client in the list
    clients.push(socket);

    socket.on('message', function (message) {

        if (!message.name_queue) {
            console.log(message);
            object.push(message);

            fs.writeFile("/home/vasile/IdeaProjects/broker/broker", JSON.stringify(object), function (err) {
                if (err) {
                    console.log(err.toString());
                }
                console.log("Message written with succes!");
            });
        }

        if (object.length > 0) {
            for (var i = 0; i < object.length; i++) {
                if (message.name_queue === object[i].queue) {

                    socket.sendMessage({"message": object[i]});
                    flag = 1;
                    delete object[i];
                    object = object.filter(function (e) {
                        return e
                    });
                    fs.writeFile("/home/vasile/IdeaProjects/broker/broker", JSON.stringify(object), function (err) {
                        if (err) {
                            console.log(err.toString());
                        }
                    });
                    break;
                }
            }
            if (flag !== 1) {
                socket.sendMessage({"message": "don't exists this queue"});
                flag=0;
            }
        } else {
            socket.sendMessage({"message": "no message in queue"});
        }
    });

    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        console.log("Disconnected\n");
    });
});

console.log("Server running at 127.0.0.1:5000");