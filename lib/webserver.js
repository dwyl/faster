var fs     = require('fs');
var path   = require('path');
var port   = process.env.FASTER_PORT || 4242;
var ip     = require('../lib/lanip');
// CORS headers so we can access this content from any device on the network:
var headers = { 'Access-Control-Allow-Origin':'*', // http://stackoverflow.com/a/28353443/1148249
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  "Content-Type": "application/javascript", "etag": new Date().getTime()
}
var app    = require('http').createServer(function (req, res) {
  // res.setHeader();
  var f    = req.url.split('/');
  var file = f[f.length-1];

  if(file === 'client.js') {
    headers["Content-Type"] = "application/javascript";
    var client = fs.readFileSync(path.resolve(__dirname+'/../lib/client.js'),"utf8");
    res.writeHead(200, headers);
    return res.end(client);
  }
  else if(file === 'socket.io.js') {
    headers["Content-Type"] = "application/javascript";
    var filename = '/../node_modules/socket.io-client/socket.io.js';
    var io = fs.readFileSync(path.resolve(__dirname+filename),"utf8");
    res.writeHead(200, headers);
    return res.end(io);
  }
  else {
    headers["Content-Type"] = "text/plain";
    res.writeHead(200, headers);
    return res.end('200');
  }
}).listen(port);

module.exports = app;
