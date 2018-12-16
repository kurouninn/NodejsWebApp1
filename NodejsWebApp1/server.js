'use strict';
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var child = null;
var port = process.env.PORT || 1337;
var html = null;
var gpio_rgb = {r:0, g:0, b:0};

html = fs.readFileSync('index.html', 'utf8');

var gpio_pin = { b: 11, r: 12, g: 13, b_on: false, r_on: false, g_on: false };
var gpio = require('rpi-gpio');
gpio.setup(gpio_pin.b, gpio.DIR_OUT, (err) => {
    if (err) {
        console.log('pin b err : ' + err);
        return ;
    }
    gpio.setup(gpio_pin.r, gpio.DIR_OUT, (err) => {
        if (err) {
            console.log('pin r err : ' + err);
            return;
        }
        gpio.setup(gpio_pin.g, gpio.DIR_OUT, (err) => {
            if (err) {
                console.log('pin g err : ' + err);
                return;
            }
        });
    });
});

process.on('SIGTERM', () => {
    console.log('get SIGTERM.\n');
    gpio.write(gpio_pin.b, false);
    gpio.write(gpio_pin.r, false);
    gpio.write(gpio_pin.g, false);
});

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        req.on('data', function (chunk) {
            var data = '' + chunk;
            var d = data.split('=');
            console.log(d[0]);
            if (d[0] == 'blue') {
                gpio_pin.b_on = !gpio_pin.b_on;
                gpio.write(gpio_pin.b, gpio_pin.b_on);
                console.log('b pin ' + gpio_pin.b_on);
            } else if (d[0] == 'red') {
                gpio_pin.r_on = !gpio_pin.r_on;
                gpio.write(gpio_pin.r, gpio_pin.r_on);
                console.log('r pin ' + gpio_pin.r_on);
            } else if (d[0] == 'green') {
                gpio_pin.g_on = !gpio_pin.g_on;
                gpio.write(gpio_pin.g, gpio_pin.g_on);
                console.log('g pin ' + gpio_pin.g_on);
            } else if (d[0] == 'blink') {

            } else if (d[0] == 'fade') {

            } else {
                gpiop.setup(gpio_pin.b, gpio.DIR_OUT).then(() => { });
            }
        });
    } else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    }

}).listen(port);

