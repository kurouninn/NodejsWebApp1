'use strict';
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var child = null;
var port = process.env.PORT || 1337;
var html = null;
var gpio_rgb = {r:0, g:0, b:0};

html = fs.readFileSync('index.html', 'utf8');

var gpio = require('rpi-gpio');

const pin17 = 17;
var flg = false;


http.createServer(function (req, res) {

    if (req.method == 'POST') {
        req.on('data', function (chunk) {
            var data = '' + chunk;
            var d = data.split('=');
            console.log(d[0]);
            if (d[0] == 'blue') {
                gpio.setup(pin17, gpio.DIR_OUT, () => {
                    console.log('gpio on');
                    gpio.write(pin17, true);
                    //gpio.end(pin17);
                });
            } else {
                gpio.setup(pin17, gpio.DIR_OUT, () => {
                    console.log('gpio off');
                    gpio.write(pin17, false);
                    //gpio.end(pin17);
                });
           }

            //rpio.write(pin0, rpio.HIGH);
            //rpio.write(pin0, rpio.LOW);
        });
    } else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    }

}).listen(port);

