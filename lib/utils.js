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
 * @callback a function that takes two arguments: error and boolean (isdir)
 *  isdir is true when the fd is a directory and false if its a file.
 */
function isdir(fd, callback) {
  fs.stat(fd, function(err, stat) {
    if(err) { // bubble up the error
      return callback(err, false);
    }
    else { // the
      var file = fd.split('/')[fd.split('/').length-1]; // just the file/dir to lookup in ignore list

      if(stat.isDirectory() && ignore.indexOf(file) === -1) {
        return callback(null,true);
      }
      else {
        return callback(null,false);
      }
    }
  }); // end fs.stat
}

module.exports = {
  isdir : isdir
}
