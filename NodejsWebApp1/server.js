'use strict';
var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 1337;
var html = null;

html = fs.readFileSync('index.html', 'utf8');


var pins = {
    r: { pin: 13, on: false, timer: null },
    g: { pin: 12, on: false, timer: null },
    b: { pin: 11, on: false, timer: null }
};

var gpio = require('rpi-gpio');

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

var timerid = null;

var server = http.createServer();
server.listen(port);

process.on('SIGTERM', () => {
    console.log('get SIGTERM.\n');
    reset();
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
            } else if (d[0] == 'green') {
            } else if (d[0] == 'blink') {
                //console.log('blink ' + gpio_pin.g_on);
                //var st = 0;
                //reset();

                //timerid = setInterval(() => {
                //    switch (st) {
                //        case 0:
                //            gpio.write(gpio_pin.b, 1);
                //            break;
                //        case 1:
                //            gpio.write(gpio_pin.b, 0);
                //            break;
                //        case 2:
                //            gpio.write(gpio_pin.r, 1);
                //            break;
                //        case 3:
                //            gpio.write(gpio_pin.r, 0);
                //            break;
                //        case 4:
                //            gpio.write(gpio_pin.g, 1);
                //            break;
                //        case 5:
                //            gpio.write(gpio_pin.g, 0);
                //            break;
                //    }
                //    st++;
                //    if (st > 5) st = 1;
                //}, 200);
            } else {
                console.log('off');
                reset();
            }
        });
    } else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    }
}).listen(port);

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

function onpin(pin) {
    pins[pin].on = 1 - pins[pin].on;
    if (pins[pin].on == 1) {
        gpio.write(pins[pin].pin, pins[pin].on);
        timeout[b] = setTimeout(() => {
            resetpin(pin);
        }, 10000);
    } else {
        resetpin(pin);
    }
    console.log(pin + ' pin ' + gpio_pin.b_on);
}

//gpio.open(gpio_pin.b, gpio.OUTPUT);
//gpio.open(gpio_pin.g, gpio.OUTPUT);
//gpio.open(gpio_pin.r, gpio.OUTPUT);


//server.on('request',function (req, res) {
//    if (req.method == 'POST') {
//        req.on('data', function (chunk) {
//            var data = '' + chunk;
//            var d = data.split('=');
//            console.log(d[0]);
//            if (d[0] == 'blue') {
//                gpio_pin.b_on = 1 - gpio_pin.b_on;
//                gpio.write(gpio_pin.b, gpio_pin.b_on);
//                if (gpio_pin.b_on == 1) {
//                    if (timeout[b])
//                    timeout[b] = setTimeout(() => {
//                        if (gpio_pin.b_on == 1) {
//                            gpio_pin.b_on = 0;
//                            gpio.write(gpio_pin.b, gpio_pin.b_on);
//                            timeout[b] = null;
//                        }
//                    }, 10000);
//                }
//                console.log('b pin ' + gpio_pin.b_on);
//            } else if (d[0] == 'red') {
//                gpio_pin.r_on = 1 - gpio_pin.r_on;
//                gpio.write(gpio_pin.r, gpio_pin.r_on);
//                if (gpio_pin.r_on == 1) {
//                    timeout[r] = setTimeout(() => {
//                        if (gpio_pin.r_on == 1) {
//                            gpio_pin.r_on = 0;
//                            gpio.write(gpio_pin.r, gpio_pin.r_on);
//                            timeout[r] = null;
//                        }
//                    }, 10000);
//                }
//                console.log('r pin ' + gpio_pin.r_on);
//            } else if (d[0] == 'green') {

//                gpio_pin.g_on = 1 - gpio_pin.g_on;
//                gpio.write(gpio_pin.g, gpio_pin.g_on);
//                console.log('g pin ' + gpio_pin.g_on);
//            } else if (d[0] == 'blink') {
//                console.log('blink ' + gpio_pin.g_on);
//                var st = 0;
//                reset();

//                timerid = setInterval(() => {
//                    switch (st) {
//                        case 0:
//                            gpio.write(gpio_pin.b, 1);
//                            break;
//                        case 1:
//                            gpio.write(gpio_pin.b, 0);
//                            break;
//                        case 2:
//                            gpio.write(gpio_pin.r, 1);
//                            break;
//                        case 3:
//                            gpio.write(gpio_pin.r, 0);
//                            break;
//                        case 4:
//                            gpio.write(gpio_pin.g, 1);
//                            break;
//                        case 5:
//                            gpio.write(gpio_pin.g, 0);
//                            break;
//                    }
//                    st++;
//                    if (st > 5) st = 1;
//                }, 200);
//            } else {
//                console.log('off');
//                reset();
//            }
//        });
//    } else if (req.method == 'GET') {
//        res.writeHead(200, { 'Content-Type': 'text/html' });
//        res.write(html);
//        res.end();
//    }
//}).listen(port);

//function reset() {
//    if (timerid != null) {
//        clearInterval(timerid);
//        timerid = null;
//    }
//    gpio_pin.b_on = 0;
//    gpio_pin.g_on = 0;
//    gpio_pin.r_on = 0;
//    gpio.write(gpio_pin.b, 0);
//    gpio.write(gpio_pin.r, 0);
//    gpio.write(gpio_pin.g, 0);
//}

/*

var gpio_pin = { b: 11, g: 12, r:13, b_on: false, r_on: false, g_on: false };
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

*/