var chalk  = require('chalk'); // colorfull console output
var red    = chalk.red, green = chalk.green, cyan = chalk.cyan, yellow =chalk.yellow;
// start websocket SERVER
var app = require('http').createServer();
var port = process.env.FASTER_PORT || 4242;
var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var io  = require('socket.io')(app);
app.listen(port);

io.on('connection', function(socket){
  var ua = socket.handshake.headers['user-agent'].split(' ');
  var agent = ua[ua.length-1];
  var client = socket.id +" " +chalk.cyan(agent);
  console.log(chalk.green("Device/Browser Connected: ") + client);

  socket.emit('message', chalk.red('Faster WebSocket Server Says Howdy Partner!') );
  // var interval = setInterval(function(){
  //   var message = "ping from server: "+ new Date();
  //   io.emit('message', message);
  // }, 5000); // used in testing

  socket.on(secret, function(data) {
    // console.log(chalk.green(data));
    socket.broadcast.emit('refresh', data);
  });

  socket.on("disconnect", function() {
    console.log(chalk.red("Refreshing Device/Browser >> ") + client);
    // clearInterval(interval);
  })
})
console.log(chalk.bgGreen.black(" >> Faster (App Reloader) Started on Port: "+port +" "));

module.exports = app;
