require('http').createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Let's Make Development Faster!\n");
}).listen(8000);
console.log("Visit: http://127.0.0.1:8000/");