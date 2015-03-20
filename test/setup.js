// create a tree of directories using https://github.com/substack/node-mkdirp
var mkdirp   = require('mkdirp');
// delete the temporary directory tree using https://github.com/isaacs/rimraf
var rimraf   = require('rimraf');
var fs       = require('fs');
var rootdir  =  __dirname+'/tmp'; // root temporary directory
var dirtree  = rootdir + '/foo/bar/baz/bat';
var filename = dirtree + '/hello.txt';
var empty    = dirtree + '/empty'

var setup = function(callback) {
  mkdirp(dirtree, function (err) {
    if (err) console.error(err)
    // else console.log('pow!')
    mkdirp(empty, function(err){
      if (err) console.error(err)
    })
    // create a file that will be *Modified* in our test
    fs.writeFile(filename, "Hi!", function(err) {
      if(err) {
        return console.log(err);
      }
      console.log(filename + " saved!");
      callback();
    });
  });
}

var teardown = function(callback) {
  rimraf(rootdir, function() {
    callback();
  })
}

module.exports = {
  setup    : setup,     // export these methods for use in the test
  teardown : teardown,
  filename : filename,  // we will update this in our test
  rootdir  : rootdir,   // and add a file to this dir
  dirtree  : dirtree,   // and add a file to the grandchild dir
  emtpy    : empty      // empty dir
}
