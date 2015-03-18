var app = require('http').createServer();
var port = process.env.PORT || 5000;
var io  = require('socket.io')(app);

app.listen(port);

io.on('connection', function(socket){
  console.log("websocket connection open!");

  socket.emit('message', 'hello from server');

  // ws.on("message", function(message){
  //   console.log(message);
  // })
  //
  var interval = setInterval(function(){
    var message = "ping from server: "+ new Date();
    io.emit('message', message);
  }, 1000);
  socket.on('click', function(data){
    console.log(data);
  })
  // setTimeout(function(){
  //   socket.emit('refresh', 'refresh the app');
  // }, 4000)
  socket.on("disconnect", function(){
    console.log("connection closed");
    // clearInterval(interval);
  })
})
