'use strict';
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var child = null;
var port = process.env.PORT || 1337;
var html = null;
var gpio = {r:0, g:0, b:0};

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
            led(d[0]);
            //console.log(d[0]);
            //child = exec('ls', (err, stdout, stderr) => {
            //    console.log('stdo' + stdout + '\n');
            //    console.log('stde' + stderr + '\n');
            //});

            //rpio.write(pin0, rpio.HIGH);
            //rpio.write(pin0, rpio.LOW);
        });
    } else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
        exec('pwd', (err, stdout, stderr) => { console.log(stdout + '\n'); })        //if (flg) {
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
        console.log('b ' + gpio.b + '\n');
        if (child != null) child.kill('SIGKILL');
        child = null;
        child = exec('/home/pi/NodejsWebApp1/NodejsWebApp1/test1 1 ' + gpio.b, (err, stdout, stderr) => { });
        gpio.b = 1 - gpio.b;
    } else if (led == 'red') {
        console.log('r ' + gpio.r + '\n');
        if (child != null) child.kill('SIGKILL');
        child = null;
        child = exec('/home/pi/NodejsWebApp1/NodejsWebApp1/test1 2 ' + gpio.r, (err, stdout, stderr) => { });
        gpio.r = 1 - gpio.r;
    } else if (led == 'green') {
        console.log('g ' + gpio.g + '\n');
        if (child != null) child.kill('SIGKILL');
        child = null;
        child = exec('/home/pi/NodejsWebApp1/NodejsWebApp1/test1 3 ' + gpio.g, (err, stdout, stderr) => { });
        gpio.g = 1 - gpio.g;
    } else if (led == 'blink') {
        if (child != null) child.kill('SIGKILL');
        child = null;
        exec('./test1 4', (err, stdout, stderr) => { });
    } else if (led == 'fade') {
        if (child != null) child.kill('SIGKILL');
        child = null;
        exec('./test1 5', (err, stdout, stderr) => { });
    }
}
