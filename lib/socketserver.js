var port   = process.env.FASTER_PORT || 4242;
var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var chalk  = require('chalk');       // colorfull console output
var io     = require('socket.io')(); // start websocket SERVER
io.listen(port);

io.on('connection', function(socket){
  var ua = socket.handshake.headers['user-agent'].split(' ');
  var agent = ua[ua.length-1];
  var client = socket.id +" " +chalk.cyan(agent);
  console.log(chalk.green("Device/Browser Connected: ") + client);

  socket.emit('message', chalk.red('Faster WebSocket Server Says Howdy Partner!') );

  socket.on(secret, function(data) {
    socket.broadcast.emit('refresh', data);
  });

  socket.on("disconnect", function() {
    console.log(chalk.red("Refreshing Device/Browser >> ") + client);
  })
})
console.log(chalk.bgGreen.bold.black(" >> Faster (App Reloader) Started on Port: "+port +" "));

module.exports = io;
