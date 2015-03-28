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
var sio;

var faster = require('../lib/');

// var faster = exec('node ./bin/faster.js', function(error, stdout, stderr) {
//   console.log("faster running");
//   console.log('stdout: ' + stdout);
//   console.log(chalk.bgRed.white.bold('stderr: ' + stderr));
//   if (error !== null) {
//       console.log(chalk.bgRed.white.bold('exec error: ' + error));
//   }
// })

test(cyan('Emit the "secret" restart event'), function(t){
  // setTimeout(function() {
  faster(function(child){
    console.log(child.pid);
    sio = ioclient.connect('http://localhost:'+port, {reconnect: true});
    sio.on(secret, function(data) {
      // socket.broadcast.emit('refresh', data);
      console.log(chalk.bgYellow.red(data));
    });
    // sio.emit(secret, ">> file updated!");
    var filename = __dirname + "/hai.text";
    var time = new Date().getTime();
    setTimeout(function(){
      fs.writeFile(filename, time, function(err){
        if(err){
          console.log(err);
        }
        // t.end();
        terminate(child.pid, function(err, done){
         t.end();
        });
      })
    }, 2000)
  })

    // fs.writeFileSync(filename, 'hai', 'utf8');
    // setTimeout(function() {
    //
    //   // terminate(faster.pid, function(err, done){
    //   //   t.end();
    //   //   // process.exit();
    //   // });
    // }, 1000);
  // }, 1500);
});




// test(cyan('Attempt to terminate without providing a Parent Process ID'), function (t) {
//   var errmsg = "Error: No pid supplied to Terminate!"
//   try {
//     terminate(); // this should throw an error
//   }
//   catch (e) {
//     t.equal(e.toString(), errmsg, green("✓ Fails when no callback supplied (as expected)"))
//     t.end();     // nothing to test
//   }
// });

// update a file in test/tmp/foo/ to trigger an update
