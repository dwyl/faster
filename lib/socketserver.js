var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var chalk  = require('chalk');       // colorfull console output
var io     = require('socket.io')(); // start websocket SERVER
var app    = require('./webserver');
io.listen(app);

io.on('connection', function(socket){
  var ua = socket.handshake.headers['user-agent'].split(' ');
  var agent = ua[ua.length-1];
  var client = socket.id +" " +chalk.cyan(agent);
  console.log(chalk.green("Device/Browser Connected: ") + client);

  socket.emit('message', chalk.red('Faster WebSocket Server Says Hi!') );

  // we use the "secret" chanel for refreshing
  socket.on(secret, function(data) {
    socket.broadcast.emit('refresh', data);
  }); // which avoids your work colleagues spamming your dev box

  socket.on("disconnect", function() {
    console.log(chalk.red("Refreshing Device/Browser >> ") + client);
  })
})

io.ip = app.ip; // export the LAN IP Address
var port   = process.env.FASTER_PORT || 4242;
var url = ' http://'+io.ip+':'+port +' ';
console.log(chalk.bgGreen.black(" >> Faster (App Reloader) Started: ")+url);
module.exports = io;
