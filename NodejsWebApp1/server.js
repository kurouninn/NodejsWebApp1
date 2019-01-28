'use strict';

var http = require('http');
var port =  1337;
var server = http.createServer();

var gpio = require('rpi-gpio');

var pins = {
    r: { pin: 13, on: false, timer: null },
    g: { pin: 12, on: false, timer: null },
    b: { pin: 11, on: false, timer: null }
};

gpio.setup(pins.b.pin, gpio.DIR_OUT, (err) => {
    if (err) {
        console.log('pin b err : ' + err);
        return;
    }
    gpio.setup(pins.r.pin, gpio.DIR_OUT, (err) => {
        if (err) {
            console.log('pin r err : ' + err);
            return;
        }
        gpio.setup(pins.g.pin, gpio.DIR_OUT, (err) => {
            if (err) {
                console.log('pin g err : ' + err);
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
            if (d[0] == 'blue') {
                onpin('b');
            } else if (d[0] == 'red') {
                onpin('r');
            } else if (d[0] == 'green') {
                onpin('g');
            } else if (d[0] == 'blink') {
                console.log('blink');
                var st = 0;
                reset();

            } else {
                console.log('off');
                reset();
            }
        });
        var url = req.headers.host.split(':');
        res.writeHead(204);
        res.end();
    } else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    }
});

function reset() {
    if (timerid != null) {
        clearInterval(timerid);
        timerid = null;
    }
    resetpin('r');
    resetpin('g');
    resetpin('b');
}

function resetpin(pin) {
    if (pins[pin].timer != null) {
        clearTimeout(pins[pin].timer);
        pins[pin].timer = null;
    }
    pins[pin].on = 0;
    gpio.write(pins[pin].pin, pins[pin].on);
}

function onpin(pin,timer=true) {
    pins[pin].on = !pins[pin].on;
    if (pins[pin].on == 1) {
        console.log(pin + ' pin on');
        gpio.write(pins[pin].pin, pins[pin].on);
        if (timer == true) pins[pin].timer = setTimeout(() => { resetpin(pin); }, 10000);
    } else {
        console.log(pin + ' pin off');
        resetpin(pin);
    }
}

server.listen(port);
