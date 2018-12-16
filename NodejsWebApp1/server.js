'use strict';
var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 1337;
var html = null;

html = fs.readFileSync('index.html', 'utf8');

process.on('SIGTERM', () => {
    console.log('get SIGTERM.\n');
    reset();
    process.exit();
}).on('SIGINT', () => {
    console.log('get SIGINT.\n');
    reset();
    process.exit();
});

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

                timerid = setInterval(() => {
                    switch (st) {
                        case 0:
                            onpin('b', false);
                            break;
                        case 1:
                            resetpin('b');
                            break;
                        case 2:
                            onpin('r', false);
                            break;
                        case 3:
                            resetpin('r');
                            break;
                        case 4:
                            onpin('g', false);
                            break;
                        case 5:
                            resetpin('g');
                            break;
                        case 6:
                            onpin('b', false);
                            onpin('r', false);
                            break;
                        case 7:
                            resetpin('b');
                            resetpin('r');
                            break;
                        case 8:
                            onpin('b', false);
                            onpin('g', false);
                            break;
                        case 9:
                            resetpin('b');
                            resetpin('g');
                            break;
                        case 10:
                            onpin('r', false);
                            onpin('g', false);
                            break;
                        case 11:
                            resetpin('r');
                            resetpin('g');
                            break;
                        case 12:
                            onpin('b', false);
                            onpin('r', false);
                            onpin('g', false);
                            break;
                        default:
                            reset();
                    }
                    st++;
                }, 1000);
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

var ffmpeg = require('fluent-ffmpeg')

// host, port and path to the RTMP stream
var host = 'localhost'
var port = '1935'
var path = '/home/pi/NodejsWebApp1/NodejsWebApp1/live'



ffmpeg('rtmp://' + host + ':' + port + path, { timeout: 432000 }).addOptions([
        '-f v4l2 -r 30 -s  640x480 -vsync 1 -i /dev/video0 -c:v h264_omx -flags +cgop+global_header -bsf:v h264_mp4toannexb -f hls -hls_time 2 -hls_list_size 2 -hls_allow_cache 0 -hls_flags delete_segments'
        //'-c:v h264_omx',
        //'-c:a aac',
        //'-ac 1',
        //'-strict -2',
        //'-crf 18',
        //'-profile:v baseline',
        //'-maxrate 400k',
        //'-bufsize 1835k',
        //'-pix_fmt yuv420p',
        //'-hls_time 10',
        //'-hls_list_size 6',
        //'-hls_wrap 10',
        //'-start_number 1'
]).output('/home/pi/NodejsWebApp1/NodejsWebApp1/output.m3u8').on('end', callback).run()

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