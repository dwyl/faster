var fs     = require('fs');
var path   = require('path');
var index  = fs.readFileSync(__dirname+'/index.html',"utf8");

var port = process.env.PORT || 5000;
require('http').createServer(function (req, res) {
  // console.log('GET: '+req.url);
  if(req.url.search('.') > -1) {
    var f    = req.url.split('/');
    var file = f[f.length-1];
    if(file === 'style.css'){
      var style  = fs.readFileSync(path.resolve(__dirname+'/../lib/style.css'),"utf8");
      res.writeHead(200, { "Content-Type": "text/css", "etag": new Date().getTime() });
      return res.end(style);
    }
    else if(file === 'client.js') {
      var client = fs.readFileSync(path.resolve(__dirname+'/../lib/client.js'),"utf8");
      res.writeHead(200, { "Content-Type": "application/javascript", "etag": new Date().getTime() });
      return res.end(client);
    }
    else {
      res.writeHead(200, {"Content-Type": "text/html"});
      return res.end(index);
    }
  } else {
    res.writeHead(200, {"Content-Type": "text/html"});
    return res.end(index);
  }
}).listen(port);
console.log("Visit: http://127.0.0.1:"+port);
