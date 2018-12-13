'use strict';
var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 1337;
var html = null;

html = fs.readFileSync('index.html', 'utf8');


var rpio = require('rpio');
//const pin0 = 0;
//var flg = false;

//rpio.open(pin0, rpio.INPUT);

http.createServer(function (req, res) {

    if (req.method == 'POST') {
        //req.on('data', function (chunk) {
        //    //rpio.write(pin0, rpio.HIGH);
        //    //rpio.write(pin0, rpio.LOW);
        //});
    } else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
        //if (flg) {
        //    rpio.write(pin0, rpio.LOW);
        //    flg = false;
        //} else {
        //    rpio.write(pin0, rpio.HIGH);
        //    flg = true;
        //}
    }

}).listen(port);

