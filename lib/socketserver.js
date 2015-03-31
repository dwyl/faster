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

  // just to test the socket server is accessible from the client
  socket.emit('message', chalk.red('Faster WebSocket Server Says Hi!') );

  // we use the "secret" chanel for refreshing
  socket.on(secret, function(data) {
    var note = ' Sending Refresh Signal to All Connected Devices/Clients '
    console.log(chalk.bgGreen.black(note));
    socket.broadcast.emit('refresh', data);
  }); // which avoids your work colleagues spamming your dev box

  socket.on("disconnect", function() {
    console.log(chalk.red("Refreshing Device/Browser >> ") + client);
  })
})

var ip = require('./lanip'); // the LAN IP Address
var port   = process.env.FASTER_PORT || 4242;
var iourl = 'http://'+ip+':'+port;
// var appport = process.env.PORT || 8000
var appurl = 'http://'+ip //+':'+ appport;
var note2self = "                                     ";
var note2self = note2self + note2self + "\n";
note2self += " >> " + chalk.bold("Faster ") + "(App Reloader) ";
note2self += chalk.bold("Started ") + "on "+ iourl;
note2self += "   \n";
note2self += " >> " + chalk.bold("Don't Forget ") + "to Add the ";
note2self += chalk.bold("Faster Client") + " script to ";
note2self += chalk.bold("your HTML Template \n");
var CDNScript = "https://rawgit.com/ideaq/faster/master/lib/client.js";
note2self += " e.g: <script src='" + CDNScript +"'></script> (CDN) \n"
note2self += chalk.bold.italic.inverse(" OR ");
note2self += " <script src='" + iourl + "/client.js'></script> (LOCAL)\n";
note2self += " Access your app in the browser using "
note2self += chalk.italic.inverse(" LAN IP Address: " +appurl +" ") + " \n";
console.log(chalk.bgGreen.black(note2self));

io.ip = ip;
module.exports = io;
