var chalk  = require('chalk'); // colorfull console output
var exec   = require('child_process').exec; // we run our script in child processes
// run the desired script as a child process
var RUN = false;
var sock = require('./socketserver'); // our simple socket server
var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var port = process.env.FASTER_PORT || 4242; // generally unused tcp port

// start SocketIO CLIENT so we can communicate internally
var ioclient = require('socket.io-client');
var sio = ioclient.connect('http://'+sock.ip+':'+port, {reconnect: true});


module.exports = function childproc() {
  var RUN = false;
  var child = exec('npm start'); // pass in the script here

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function(data) {
    console.log("data: "+chalk.cyan(data))
    if(!RUN) { // this will only happen once
      setTimeout(function() { // give the child process server
        sio.emit(secret, "refresh");
      },300); // 300 ms to start up.
      RUN = true;
      console.log("RUN: "+RUN)
    } else {
      // don't polute the console unless you are debugging
    }
  });


  // un-comment this when testing ...
  // child.stderr.on('data', function(data) {
  //   if(!run) {
  //     var str = data.toString();
  //     if(str.search('EADDRINUSE') === -1){
  //       console.log(data);
  //     }
  //     else {
  //       console.log(green("Running: "+cyan('npm start'))
  //       +" at " + green(new Date().toTimeString()));
  //       run = true;
  //     }
  //   }
  // });

  child.on('close', function(code) {
      // console.log(green('>> Closing Child Process'));
  });

  return child;
}
