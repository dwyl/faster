var chalk  = require('chalk'); // colorfull console output
var red    = chalk.red, green = chalk.green, cyan = chalk.cyan, yellow =chalk.yellow;
var exec   = require('child_process').exec; // we run our script in child processes
// run the desired script as a child process
module.exports = function childproc() {
  var run = false;
  var child = exec('npm start'); // pass in the script here
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
    console.log(cyan(data))
  });

  child.stderr.on('data', function(data) {
    if(!run) {
      var str = data.toString();
      if(str.search('EADDRINUSE') > -1 || str.search('events.js') > -1){
        console.log(red(">> Re-Starting: "+cyan('npm start'))
          +" at " + green(new Date().toTimeString()));
        run = true;
      }
      else {
        console.log(data);
      }
    }
  });
  child.on('close', function(code) {
      console.log(yellow('>> Closing Child Process'));
  });

  child.on('exit', function(code) {
      console.log(yellow('>> Closing Child Process'));
  });

  child.on('uncaughtException', function(err) {
    console.log(red('ERROR:' + err));
    index();
  });
  return child;
}
