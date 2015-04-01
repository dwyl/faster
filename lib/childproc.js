var chalk = require('chalk'); // colorfull console output
// run the desired script as a child process
var exec  = require('child_process').exec; // we run our script in child processes
var ip    = require('./lanip');
var RUN   = false;

// print the console message once Faster starts:
require('./boot-console-message.js'); // does not matter where we require this.

var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var port = process.env.FASTER_PORT || 4242; // generally unused tcp port

// start SocketIO CLIENT so we can communicate internally
var ioclient = require('socket.io-client');
var sio = ioclient.connect('http://'+ip+':'+port, {reconnect: true});


module.exports = function childproc() {
  var RUN = false;
  var child = exec('npm start'); // pass in the script here

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function(data) {
    if(!RUN) { // this will only happen once
      sio.emit(secret, "refresh");
      RUN = true;
      console.log("RUN: "+RUN)
    } else {
      // don't polute the console unless you are debugging
    }
    console.log(chalk.cyan(data))
  });


  // un-comment if you are helping to develop the faster module!
  // child.stderr.on('data', function(data) {
  //   if(!RUN) {
  //     var str = data.toString();
  //     if(str.search('EADDRINUSE') === -1){
  //       console.log(data);
  //     }
  //     else {
  //       console.log(green("Running: "+cyan('npm start'))
  //       +" at " + green(new Date().toTimeString()));
  //       RUN = true;
  //     }
  //   }
  // });

  child.on('close', function(code) {
      // console.log(green('>> Closing Child Process'));
  });

  return child;
}
