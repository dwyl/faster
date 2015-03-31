var fs     = require('fs');
var path   = require('path');
var port   = process.env.FASTER_PORT || 4242;
var app    = require('http').createServer(function (req, res) {
  var f    = req.url.split('/');
  var file = f[f.length-1];
  if(file === 'style.css') {
    var style  = fs.readFileSync(path.resolve(__dirname+'/../lib/style.css'),"utf8");
    res.writeHead(200, { "Content-Type": "text/css", "etag": new Date().getTime() });
    return res.end(style);
  }
  else if(file === 'client.js') {
    var client = fs.readFileSync(path.resolve(__dirname+'/../lib/client.js'),"utf8");
    res.writeHead(200, { "Content-Type": "application/javascript", "etag": new Date().getTime() });
    return res.end(client);
  }
  else if(file === 'socket.io.js') {
    var filename = '/../node_modules/socket.io-client/socket.io.js';
    var io = fs.readFileSync(path.resolve(__dirname+filename),"utf8");
    res.writeHead(200, { "Content-Type": "application/javascript", "etag": new Date().getTime() });
    return res.end(io);
  }
  else {
    return res.end('404');
  }
}).listen(port);

module.exports = app;
