var net = require('net');
var readline = require('readline');
var JsonSocket = require('json-socket');

var obj=null;
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
        obj = line;
        var all = obj.split(' ');
        var queue = all[1];
        var message = all[0];

        client.sendMessage({"queue": queue, "message":message});
    });
});

client.on('close', function () {
    process.exit();
});



