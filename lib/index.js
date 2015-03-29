var fs     = require('fs');
var path   = require('path');  // used to normalise directory paths
var chalk  = require('chalk'); // colorfull console output
var red    = chalk.red, green = chalk.green, cyan = chalk.cyan, yellow =chalk.yellow;
var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var port = process.env.FASTER_PORT || 4242;

var ignored = ['.git', 'node_modules', 'npm-debug.log', 'coverage', 'lib-cov'];
var listdirs  = require('listdirs'); // https://www.npmjs.com/package/listdirs
var terminate = require('terminate'); //
var childproc = require('./childproc');
var socketserver = require('./socketserver'); // our simple socket server

// start SocketIO CLIENT so we can communicate internally
var ioclient = require('socket.io-client');
var sio = ioclient.connect('http://localhost:'+port, {reconnect: true});

var child;         // child process GLOBAL
var index;         // see below (declaring before use for jshint)
var watching = []; // global list of directories we are watching

var watch = function(dir) {
    fs.watch(dir, function (event, filename) {
      if (filename && ignored.indexOf(filename) === -1) {
        console.log(chalk.bgGreen.black(" >> " + filename +" " + event + "d "));
        sio.emit(secret, ">> " + filename +" "+event+"d");
        setTimeout(function(){
          terminate(child.pid, function(err, done){
            return index();
          });
        },10);
      } else {
        // console.log('filename not provided');
      }
    });
  }

// watch all files in this directory and all sub-directories
index = function(callback) {
  var parent = path.resolve(__dirname+'/../../../'); // ship
  // var parent = path.resolve(__dirname+'/../'); // dev
  console.log(red(parent));
  listdirs(parent, function dirslisted(err, dirs) {
    child = childproc(); // boot the child script
    dirs.forEach(function(dir) {  // watch ALL of the dirs!
      if(watching.indexOf(dir) === -1) {
        watching.push(dir);
        watch(dir);
      } else {
        // do nothing. (istanbul wants an else...)
      }
    });
    console.log(chalk.green("✓ Project Re-Indexed"));
    if(callback && typeof callback === 'function'){
      callback(child);
    }
  }, ignored); // don't watch items listed in .gitignore
}

index.terminate = function(callback) {
  terminate(child.pid, function(err, done){
    callback(err, done);
    process.exit();
  });
}

module.exports = index;
