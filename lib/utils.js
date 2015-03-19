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
function isdir(fd, dirlist, callback) {
  fs.stat(fd, function(err, stat) {
    if(err) { // bubble up the error
      return callback(err, false, fd, dirlist);
    }
    else { // the
      var file = fd.split('/')[fd.split('/').length-1]; // just the file/dir to lookup in ignore list

      if(stat.isDirectory() && ignore.indexOf(file) === -1) {
        return callback(null,true, fd, dirlist);
      }
      else {
        return callback(null, false, fd, dirlist);
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
 */
function isdirhandler(err, isdir, fd, dirlist, callback) {
  if(!err && isdir) {
    dirlist.push(fd);               // add the dir to the dirlist
    return callback(null, dirlist); // and return the enlarged list
  }
  else {
    return callback(null, dirlist); // just return the original list
  }
}


module.exports = {
  isdir        : isdir,
  isdirhandler : isdirhandler
}
