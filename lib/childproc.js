var chalk  = require('chalk'); // colorfull console output
var exec   = require('child_process').exec; // we run our script in child processes
// run the desired script as a child process
module.exports = function childproc() {
  var run = false;
  var child = exec('npm start'); // pass in the script here
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
    console.log(chalk.cyan(data))
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
