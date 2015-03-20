var fs    = require('fs');
var path  = require('path');
var chalk = require('chalk');

/**
 * ignore is a list of files and directories we do NOT want to watch.
 * Q: should we extract the list of files/dirs to ignore from .gitignore ...?
 */
var ignore = ['.git','.gitignore', 'node_modules', 'coverage', '.vagrant', 'Vagrant', 'npm-debug.log'];
/**
 * @counter GLOBAL counter used to keep track of how many file descriptors we still have to check!
 * Q: can anyone see a *better* way of doing this ...?
 */
var counter = 0;
var dirlist = [];

var setcounter = function(value) {
  return counter = value;
}

var cleardirlist = function(dir) {
  return [];
}

var setdirlist = function(dir) {

}
/**
 * check if the fd is a file or directory
 * (we only care about dirs for watching purposes)
 * @fd {string} is a complete file (or directory) descriptor
 * @dirlist {array} is the list of valid directories we pass around by reference
 * @callback {function} that takes two arguments: error and boolean (isdir)
 *  isdir is true when the fd is a directory and false if its a file.
 */
function isdir(fd, dirlist, callback, keepwalking, afterwalking) {
  if(dirlist.indexOf(fd) > -1) {
    console.log(chalk.bgBlue.white(" isdir >> "+fd
      +" |  counter: "+counter+ " | dirs:" + dirlist.length +" "));
    return callback(dirlist);
  }
  fs.stat(fd, function(err, stat) {
    if(err){
      console.log(chalk.bgRed("ERROR: ", err))
    }
    else {

      console.log("isdir >> "+fd + " | stat.isDirectory(): "+stat.isDirectory()
        +" |  counter: "+counter);
      var last = fd.split('/')[fd.split('/').length-1]; // just the last part of fd to lookup in ignore list
      if(stat.isDirectory() && ignore.indexOf(last) === -1) {
        dirlist.push(fd);   // add the dir to the dirlist
        console.log(chalk.bgGreen.black.bold(' - - - - - -> KEEP on WALKING: '+counter +" "));
        fs.readdir(fd, function(err,files) {
          console.log(chalk.bgGreen.black("err: " +err
            + " | files: " +files.length + " | counter: "+counter));
          if(!err && files.legnth === 0 && counter !== 0) {
            return callback(dirlist); // do nothing.
          } else {
            return keepwalking(fd, dirlist, afterwalking); // keep walking
          }
        })
      }
      else {
        counter--;
        return callback(dirlist);
        // no more walking
      }
    }
    counter--;
    if(counter === 0){
      console.log(chalk.bgGreen.black(' -> DONE WALKING count:'+counter
        + " | dirs:" + dirlist.length +" "));
      return afterwalking(dirlist);
    } else {
      console.log(chalk.grey(' -> CALLBACK counter: '+counter));
      return callback(dirlist);
    }

  }); // end fs.stat
}

/**
 * isdirhandler is our *named* callback
 * since jlint/jshint does not allow us to declare functions inside for loops!
 * @err {object} is a complete file (or directory) descriptor
 * @isdir {bool} true if the fd is a directory false otherwise
 * @dirlist {array} the list of directories (avoids having a GLOBAL array!)
 * @fd {string} the original full filepath to a directory or file
 * @dirlist {array} is the list of valid directories we pass around by reference
 * @callback {function} that takes two arguments: error and dirlist
 * @final {function} is the *FINAL* function that gets called once all walking is done
 */
function isdirhandler(dirlist) {
  console.log(chalk.bgYellow.black("counter: " + counter + " | dirlist: " + dirlist.length));
}

// // this is a do-nothing place-holder function
// function next(dirlist) {
//   return console.log(">>>> dirlist.length: "+dirlist.length);
// }

/**
 * walk does the work of walking a directory
 * if a directory contains more than one file check each file using isdir
 * if isdir returns true we need to *keep walking*
 *
 */
var walk = function(dir, dirlist, afterwalking) {
  console.log(chalk.bgRed(" walk :" +dir
    + " | counter: "+ counter + " | dirs:" + dirlist.length +" "))
  fs.readdir(dir, function(err,files) {
    var filecount = files.length;
    console.log(chalk.bgGreen.black(" filecount: "+filecount +" "), files);
    counter = counter + filecount; // a count of how many descriptors we still have to check
    if(filecount === 0) {
      counter--;
      console.log(chalk.bgCyan.black(" EMPTY DIR! " +dir +" | filecount: "+filecount
      +" | counter:"+counter + " | dirs:" + dirlist.length+" "));
      // counter = 1;
      // dirlist.push(dir);   // add the dir to the dirlist
      isdir(dir, dirlist, isdirhandler, walk, afterwalking);
      // isdir(dir, dirlist, isdirhandler, walk, afterwalking);
    }
    else if(filecount === 1) {
      var fd = path.resolve(dir + '/' + files[0]);
      isdir(fd, dirlist, isdirhandler, walk, afterwalking);
    }
    else {
      // console.log("FileCount: "+filecount);
      for(var i = 0; i < files.length; i++) {
        var fd = path.resolve(dir + '/' + files[i]);
        isdir(fd, dirlist, isdirhandler, walk, afterwalking);
      }
    }
  });
}
/*
if(filecount === 0 && count === 0){
  count--;
  return callback();
}
if(filecount === 1){
  var file = path.resolve(dir + '/' + files[0]);
  isdir(file, 0, callback);
}
else {
  for(var i = files.length-1; i >= 0; i--) {
    var file = path.resolve(dir + '/' + files[i]);
     isdir(file, i, callback);
  }
}
*/


module.exports = {
  isdir        : isdir,
  isdirhandler : isdirhandler,
  setcounter   : setcounter,
  walk         : walk
}
