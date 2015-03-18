var fs    = require('fs');
var index = fs.readFileSync(__dirname+'/client.html',"utf8");
// console.log(index);
var port = process.env.PORT || 4000;
require('http').createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(index);
}).listen(port);
console.log("Visit: http://127.0.0.1:"+port);
