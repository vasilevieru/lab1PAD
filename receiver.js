var net = require('net');
var JsonSocket = require('json-socket');

var client = new JsonSocket(new net.Socket());


client.connect(5000, '127.0.0.1');
client.on('connect', function () {

    client.sendMessage({"command": "read"});

    client.on('message', function (message) {
        console.log(message.sms);

    });
});

client.on('close', function () {
    process.exit();
});
