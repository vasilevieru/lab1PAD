var net = require('net');
var readline = require('readline');
var JsonSocket = require('json-socket');
var event = require('events').EventEmitter.prototype._maxListeners = 0;

var client = new JsonSocket(new net.Socket());

client.connect(5000,'127.0.0.1');

client.on('connect', function () {
    console.log('Connected');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function (line) {
        client.sendMessage({"message":line});
    });
});

client.on('close', function () {
    process.exit();
});



