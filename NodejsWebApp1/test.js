
var HLSServer = require('hls-server')
var http = require('http')

var server = http.createServer()
var hls = new HLSServer(server, {
    path: '/',     // Base URI to output HLS streams
    dir: 'live'  // Directory that input files are stored
})
server.listen(1935)