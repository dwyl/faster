var fs = require('fs');

/**
 * ignore is a list of files and directories we do NOT want to watch.
 * Q: should we extract the list of files/dirs to ignore from .gitignore ...?
 */
var ignore = ['.git','.gitignore', 'node_modules', 'coverage', '.vagrant', 'Vagrant', 'npm-debug.log'];

/**
 * check if the fd is a file or directory
 * (we only care about dirs for watching purposes)
 * @fd {string} is a complete file (or directory) descriptor
 * @dirlist {array} is the list of valid directories we pass around by reference
 * @callback {function} that takes two arguments: error and boolean (isdir)
 *  isdir is true when the fd is a directory and false if its a file.
 */
function isdir(fd, dirlist, count, callback, next, final) {
  fs.stat(fd, function(err, stat) {
    count--;
    if(err) { // bubble up the error
      return callback(err, false, dirlist, next);
    }
    else { // the
      var file = fd.split('/')[fd.split('/').length-1]; // just the file/dir to lookup in ignore list

      if(stat.isDirectory() && ignore.indexOf(file) === -1) {
        dirlist.push(fd);   // add the dir to the dirlist
        // walk(fd, dirlist, count, final);
        return callback(null, true, dirlist, next);
      }
      else {
        return callback(null, false, dirlist, next);
      }
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
function isdirhandler(err, isdir, dirlist, callback) {
  if(!err && isdir) {
    return callback(dirlist); // and return the enlarged list
  }
  else {
    return callback(dirlist); // just return the original list
  }
}

// this is a do-nothing place-holder function
function next(dirlist) {
  return console.log(">>>> dirlist.length: "+dirlist.length);
}

/**
 * walk does the work of walking a directory
 * if a directory contains more than one file check each file using isdir
 * if isdir returns true we need to *keep walking*
 *

function walk(dir, dirlist, count, afterwalking) {
  fs.readdir(dir, function(err,files) {
    var filecount = files.length;
    count = count + filecount; // a count of how many descriptors we still have to walk
    // if(filecount === 1){
    //   var fd = path.resolve(dir + '/' + files[0]);
    //   isdir(file, 0, callback);
    // }
    // console.log("FileCount: "+filecount);
    for(var i = files.length-1; i >= 0; i--) {
      var fd = path.resolve(dir + '/' + files[i]);
       isdir(fd, dirlist, isdirhandler, count, afterwalking);
    }


    if(count === 0) {
      return afterwalking(dirlist); // pass control back to index
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
  next         : next
  // walk         : walk
}
