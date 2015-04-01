var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var chalk  = require('chalk');       // colorfull console output
var useragent = require('useragent'); //https://github.com/3rd-Eden/useragent
var io     = require('socket.io')(); // start websocket SERVER
var app    = require('./webserver');
io.listen(app);

io.on('connection', function(socket){
  // var ua = socket.handshake.headers['user-agent'].split(' ');
  var agent = useragent.parse(socket.handshake.headers['user-agent']);
  // var agent = ua[ua.length-1];
  var client = socket.id +" " +chalk.cyan(agent);
  console.log(chalk.green("Browser / Device Connected: ") + client);

  // just to test the socket server is accessible from the client
  socket.emit('message', chalk.red('Faster WebSocket Server Says Hi!') );

  // we use the "secret" chanel for refreshing
  socket.on(secret, function(data) {
    var note = ' Sending Refresh Signal to All Connected Devices/Clients '
    console.log(chalk.bgGreen.black(note));
    socket.broadcast.emit('refresh', data);
  }); // which avoids your work colleagues spamming your dev box

  socket.on("disconnect", function() {
    // console.log(chalk.red("Refreshing Device/Browser >> ") + client);
  })
})

module.exports = io;
