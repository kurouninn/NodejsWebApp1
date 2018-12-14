'use strict';
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var child = null;
var port = process.env.PORT || 1337;
var html = null;

html = fs.readFileSync('index.html', 'utf8');


var rpio = require('rpio');

const pin0 = 0;
var flg = false;

//rpio.open(pin0, rpio.INPUT);
//rpio.write(pin0, rpio.HIGH);

http.createServer(function (req, res) {

    if (req.method == 'POST') {
        req.on('data', function (chunk) {
            var data = '' + chunk;
            var d = data.split('=');
            console.log(d[0]);
            child = exec('ls', (err, stdout, stderr) => {
                console.log('stdo' + stdout + '\n');
                console.log('stde' + stderr + '\n');
            });

            //rpio.write(pin0, rpio.HIGH);
            //rpio.write(pin0, rpio.LOW);
        });
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

function led(led) {
    if (led == 'blue') {
        if (child != null) child.kill('SIGHUP');
        child = null;
        child = exec('./test1 1', (err, stdout, stderr) => { });
    } else if (led == 'red') {
        if (child != null) child.kill('SIGHUP');
        child = null;
        exec('./test1 2', (err, stdout, stderr) => { });
    } else if (led == 'green') {
        if (child != null) child.kill('SIGHUP');
        child = null;
        exec('./test1 3', (err, stdout, stderr) => { });
    } else if (led == 'blink') {
        if (child != null) child.kill('SIGHUP');
        child = null;
        exec('./test1 4', (err, stdout, stderr) => { });
    } else if (led == 'fade') {
        if (child != null) child.kill('SIGHUP');
        child = null;
        exec('./test1 5', (err, stdout, stderr) => { });
    }
}
