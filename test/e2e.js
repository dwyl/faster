var test  = require('tape');
var chalk = require('chalk');
var red = chalk.red, green = chalk.green, cyan = chalk.cyan;
var exec = require('child_process').exec;
var port = process.env.FASTER_PORT || 4242;
var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var terminate = require('terminate'); // knew this would come in handy! ;-)
var fs = require('fs');
// start SocketIO CLIENT so we can listen for the restart event
var ioclient = require('socket.io-client');
// var sio;
var socket;

var faster = require('../lib/');

test(cyan('Run Faster. Update a File. Listen for Re-Start Event. Close'), function(t){

  faster(function(child){
    t.true(parseInt(child.pid, 10) > 0, green("✓ Child Process Running ") + cyan(child.pid))
    setTimeout(function(){
      socket = require('socket.io-client')('http://localhost:'+port);
      console.log(chalk.bgYellow.red.bold(" Socket.io Client Started "))
      socket.on('refresh', function(data) {
        console.log(chalk.bgYellow.red(data));
      });
    }, 500);

    var filename = __dirname + "/hai.txt";
    var time = new Date().getTime();
    fs.writeFile(filename, time, function(err){
      if(err) {
        console.log(err);
      }
      setTimeout(function(){
        socket.disconnect();
        faster.terminate(function(err, done){
          t.true(done, green("✓ Cleanup Complete"))
          t.end();
        });
      },2000);
    });
  })
});
