'use strict';

// loosely based on https://gist.github.com/bnerd/2011232
// requires node.js >= v0.10.0
// assumes that HLS segmenter filename base is 'out'
// and that the HLS playlist and .ts files are in the current directory
// point Safari browser to http://<hostname>:PORT/player.html

//var fs = require('fs');
//var port = process.env.PORT || 1337;
//var html = null;

//html = fs.readFileSync('index.html', 'utf8');

//process.on('SIGTERM', () => {
//    console.log('get SIGTERM.\n');
//    reset();
//    process.exit();
//}).on('SIGINT', () => {
//    console.log('get SIGINT.\n');
//    reset();
//    process.exit();
//});

//var pins = {
//    r: { pin: 13, on: false, timer: null },
//    g: { pin: 12, on: false, timer: null },
//    b: { pin: 11, on: false, timer: null }
//};

//var gpio = require('rpi-gpio');

//gpio.setup(pins.b.pin, gpio.DIR_OUT, (err) => {
//    if (err) {
//        console.log('pin b err : ' + err);
//        return;
//    }
//    gpio.setup(pins.r.pin, gpio.DIR_OUT, (err) => {
//        if (err) {
//            console.log('pin r err : ' + err);
//            return;
//        }
//        gpio.setup(pins.g.pin, gpio.DIR_OUT, (err) => {
//            if (err) {
//                console.log('pin g err : ' + err);
//                return;
//            }
//        });
//    });
//});

//var timerid = null;

//var server = http.createServer();

//server.on('request', function (req, res) {
//    if (req.method == 'POST') {
//        req.on('data', function (chunk) {
//            var data = '' + chunk;
//            var d = data.split('=');
//            console.log(d[0]);
//            if (d[0] == 'blue') {
//                onpin('b');
//            } else if (d[0] == 'red') {
//                onpin('r');
//            } else if (d[0] == 'green') {
//                onpin('g');
//            } else if (d[0] == 'blink') {
//                console.log('blink');
//                var st = 0;
//                reset();

//                timerid = setInterval(() => {
//                    switch (st) {
//                        case 0:
//                            onpin('b', false);
//                            break;
//                        case 1:
//                            resetpin('b');
//                            break;
//                        case 2:
//                            onpin('r', false);
//                            break;
//                        case 3:
//                            resetpin('r');
//                            break;
//                        case 4:
//                            onpin('g', false);
//                            break;
//                        case 5:
//                            resetpin('g');
//                            break;
//                        case 6:
//                            onpin('b', false);
//                            onpin('r', false);
//                            break;
//                        case 7:
//                            resetpin('b');
//                            resetpin('r');
//                            break;
//                        case 8:
//                            onpin('b', false);
//                            onpin('g', false);
//                            break;
//                        case 9:
//                            resetpin('b');
//                            resetpin('g');
//                            break;
//                        case 10:
//                            onpin('r', false);
//                            onpin('g', false);
//                            break;
//                        case 11:
//                            resetpin('r');
//                            resetpin('g');
//                            break;
//                        case 12:
//                            onpin('b', false);
//                            onpin('r', false);
//                            onpin('g', false);
//                            break;
//                        default:
//                            reset();
//                    }
//                    st++;
//                }, 1000);
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
//});

//function reset() {
//    if (timerid != null) {
//        clearInterval(timerid);
//        timerid = null;
//    }
//    resetpin('r');
//    resetpin('g');
//    resetpin('b');
//}

//function resetpin(pin) {
//    if (pins[pin].timer != null) {
//        clearTimeout(pins[pin].timer);
//        pins[pin].timer = null;
//    }
//    pins[pin].on = 0;
//    gpio.write(pins[pin].pin, pins[pin].on);
//}

//function onpin(pin,timer=true) {
//    pins[pin].on = !pins[pin].on;
//    if (pins[pin].on == 1) {
//        console.log(pin + ' pin on');
//        gpio.write(pins[pin].pin, pins[pin].on);
//        if (timer == true) pins[pin].timer = setTimeout(() => { resetpin(pin); }, 10000);
//    } else {
//        console.log(pin + ' pin off');
//        resetpin(pin);
//    }
//}

//const { NodeMediaServer } = require('node-media-server');

//const config = {
//    rtmp: {
//        port: 1935,
//        chunk_size: 60000,
//        gop_cache: true,
//        ping: 60,
//        ping_timeout: 30
//    },
//    //http: {
//    //    port: 8000,
//    //    allow_origin: '*'
//    //}
//};

//var nms = new NodeMediaServer(config)
//nms.run();

//server.listen(port);


var http = require('http');
var port = process.env.PORT || 1337;

var server = http.createServer();

server.on('request', function (req, res) {
    if (req.method == 'POST') {
        console.log('post');
        req.on('data', function (chunk) {
            var data = '' + chunk;
            var d = data.split('=');
            console.log(d[0]);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end();
        });
    } else if (req.method == 'GET') {
        console.log('get');
        //res.writeHead(200, { 'Content-Type': 'text/html' });
        //res.write(html);
        //res.end();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end();
    }
});


server.listen(port);

