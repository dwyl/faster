var fs     = require('fs');
var path   = require('path');  // used to normalise directory paths
var chalk  = require('chalk'); // colorfull console output

var ignored = ['.git', 'node_modules', 'npm-debug.log', 'coverage', 'lib-cov'];
var listdirs  = require('listdirs');  // https://www.npmjs.com/package/listdirs
var terminate = require('terminate'); // allows us to terminate all node process
var sock      = require('./socketserver'); // our simple socket server
var childproc = require('./childproc'); // basic child process runner

var BASEDIR;       // keep a record of the original basedir
var CHILD;         // child process GLOBAL
var index;         // see below (declaring before use in once for jshint!)
var RUN = false;   // ensures we only run the "once" callback once. :-)

/** 
 * once is the callback given to fs.watch below. its a private method.
 * just had to define it outside of the forEach for memory efficiency
 * refresh calls the index method to re-index all directories and re-start
 * the child process. After that is complete the callback (provided to index)
 * sends the "secret" signal to our the Socket.IO server in
 * socketserver.js which then broadcasts the refresh message to all clients.
 */
var once = function(event, filename) {
  if (!RUN  && filename && ignored.indexOf(filename) === -1
  && filename.indexOf('npm-debug.log') === -1) {
    RUN = true;
    console.log(chalk.bgGreen.black(" >> " + filename +" " + event + "d "));
    terminate(CHILD.pid, function refresh(err, done){
      return index(BASEDIR, function(){});
    }); // see: https://www.npmjs.com/package/terminate
  } else {
    // console.log('filename not provided');
  }
}

/**
 * index is the star of our show. (but has a few supporting cast members)
 * The first step is to lookup the parent of our current working directory
 * so we know where to start watching.
 * Next we crawl all the directories starting from that parent and once
 * we have the array of dirs we loop through and watch them all.
 * We the once callback provided to fs.watch handles refreshing the clients.
 * @param basedir {string} (required) - is the base directory (watch all inside)
 * @param callback {function} (require) - we run this after all the directories
 * have been indexed (recall that forEach is sync no danger of early callback)
 */
index = function(basedir, callback) {
  BASEDIR = basedir; // keep this for later.
  RUN = false;
  var parent = path.resolve(__dirname+basedir);
  console.log("Base directory: "+chalk.cyan(parent));
  listdirs(parent, function dirslisted(err, dirs) {
    CHILD = childproc(); // boot the child script
    dirs.forEach(function(dir) {  // watch ALL of the dirs!
      fs.watch(dir, once); // only run the restart callback once!
    });
    console.log(chalk.green("✓ Project Re-Indexed"));
    return callback(CHILD);
  }, ignored); // don't watch items listed in .gitignore
}

/**
 * terminate simply exposes https://www.npmjs.com/package/terminate
 * only used in our testing so we can shut down the child process
 * but if other people want to use it, its available.
 */
index.terminate = function(callback) {
  terminate(CHILD.pid, function(err, done){
    callback(err, done);
    process.exit();
  });
}

index.ip = require('./lanip'); // the LAN IP Address

module.exports = index;
