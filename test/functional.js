// create a tree of directories using https://github.com/substack/node-mkdirp
var mkdirp  = require('mkdirp');
// delete the temporary directory tree using https://github.com/isaacs/rimraf
var rimraf = require('rimraf');
var tempdir =  __dirname+'/tmp'; // root temporary directory
var dirtree = tempdir + '/foo/bar/baz/bat';
var fs      = require('fs');

var setup = function(callback) {
  mkdirp(dirtree, function (err) {
      if (err) console.error(err)
      // else console.log('pow!')

      var filename = dirtree + '/hello.txt';
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

//
var teardown = function(callback) {
  rimraf(__dirname+'/tmp/', function(){
    callback();
  })
}

setup(function(){
  setTimeout(function(){
    teardown(function(){
      console.log('all done');
    })
  },2000);
})
