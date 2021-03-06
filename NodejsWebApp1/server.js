'use strict';

var http = require('http');
var port =  1337;
var server = http.createServer();

var gpio = require('rpi-gpio');

var pins = {
    p11: { pin: 11, on: false, },
    p12: { pin: 12, on: false, },
    p13: { pin: 13, on: false, },
};

gpio.setup(pins.p11.pin, gpio.DIR_OUT, (err) => {
    if (err) {
        console.log('pin 11 err : ' + err);
        return;
    }
    gpio.setup(pins.p12.pin, gpio.DIR_OUT, (err) => {
        if (err) {
            console.log('pin 12 err : ' + err);
            return;
        }
        gpio.setup(pins.p13.pin, gpio.DIR_OUT, (err) => {
            if (err) {
                console.log('pin 13 err : ' + err);
                return;
            }
        });
    });
});

server.on('request', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', function (chunk) {
            var data = '' + chunk;
            var d = data.split('=');
            console.log(d[0]);
            if (d[0] == 'p11') {
                onpin('p11');
            } else if (d[0] == 'p12') {
                onpin('p12');
            } else if (d[0] == 'p13') {
                onpin('p13');
            } else {
                console.log('off');
                reset();
            }
        });
        var url = req.headers.host.split(':');
        res.writeHead(204);
        res.end();
    }
});

function reset() {
    resetpin('p11');
    resetpin('p12');
    resetpin('p13');
}

function resetpin(pin) {
    pins[pin].on = 0;
    gpio.write(pins[pin].pin, pins[pin].on);
}

function onpin(pin) {
    pins[pin].on = !pins[pin].on;
    if (pins[pin].on == 1) {
        console.log(pin + ' pin on');
        gpio.write(pins[pin].pin, pins[pin].on);
    } else {
        console.log(pin + ' pin off');
        resetpin(pin);
    }
}

server.listen(port);
