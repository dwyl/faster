var fs   = require('fs');
var path = require('path');

// should we extract from .gitignore?
var ignore = ['.git','.gitignore', 'node_modules', 'coverage', '.vagrant', 'Vagrant'];

var dirs = [__dirname]; // GLOBAL list (array) of all directories
var done = 0;  // we only start watching when done is Zero

function checkisfile(arg, index, callback) {
  var fd = arg.split('/')[arg.split('/').length-1]; // just the file/dir
  fs.stat(arg, function(err, stat) {
    if(err) {
      console.log(err)
      callback();
    }
    console.log(index +" | " + done +" | " + arg +" | "+fd +" | isFile: " + stat.isFile())
    if(stat.isDirectory() && ignore.indexOf(fd) === -1) {
      dirs.push(arg);
      walk(arg, callback);
    }
    if(callback && typeof callback === 'function' && index === 0){
      done--;
      return callback();
    }
    else {
      return true;
    }
  }); // end fs.stat
}

function walk(dir, callback) {
  // console.log("                                                                 walk: "+dir)
  done++;
  fs.readdir(dir, function(err,files){
    var filecount = files.length;
    // console.log("FileCount: "+filecount);
    if(filecount === 0){
      done--;
      return callback();
    }
    if(filecount === 1){
      var file = path.resolve(dir + '/' + files[0]);
      checkisfile(file, 0, callback);
    }
    else {
      for(var i = files.length-1; i >= 0; i--) {
        var file = path.resolve(dir + '/' + files[i]);
         checkisfile(file, i, callback);
      }
    }
  });
}

// watch all files in this directory and all sub-directories
function index() {
  dirs = [];
  console.log("                                                                Re-Index "+new Date())
  walk(__dirname, function(){
    if(done === 0){
      uniquedirs = dirs.filter(function(item, pos) {
        return dirs.indexOf(item) == pos;
      })
      console.log(uniquedirs);
      // console.log("                                                done.")
      uniquedirs.map(function(dir){
        // watch ALL of the dirs!
        fs.watch(dir, function (event, filename) {
          console.log('event is: ' + event);
          console.log(" - - - - - - - - - ");
          console.log(filename);
          if (filename) {
            console.log('                                           filename provided: ' + filename);
            return index();
          } else {
            console.log('filename not provided');
          }
        });
      })
    }
    else {
      // console.log("not done yet ... "+done);
    }
  })
}

index();

process.on('uncaughtException', function(err) {
  console.log('ERROR:' + err);
  index();
});
