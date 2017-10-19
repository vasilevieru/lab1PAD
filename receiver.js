var net = require('net');
var JsonSocket = require('json-socket');
var readline = require('readline');

var client = new JsonSocket(new net.Socket());


client.connect(5000, '127.0.0.1');
client.on('connect', function () {

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        var queue = line;
        client.sendMessage({"name_queue":queue});
    });

    //client.sendMessage({"command": "read"});

    client.on('message', function (message) {
        console.log(message.message);

    });
});

client.on('close', function () {
    process.exit();
});
