var WebSocketServer = require('ws').Server;
var http = require('http');
var port = process.env.PORT || 5000;
var server = http.createServer();
server.listen(port);

var wss = new WebSocketServer({
  server: server
})
console.log("WS Server Created")

wss.on('connection', function(ws){
  console.log("websocket connection open!");

  ws.on("message", function(message){
    console.log(message);
  })

  var interval = setInterval(function(){
    var message = "ping from server: "+ new Date();
    ws.send(message, function() { });
  }, 1000);

  ws.on("close", function(){
    console.log("connection closed");
    clearInterval(interval);
  })
})
