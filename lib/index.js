var fs     = require('fs');
var path   = require('path');  // used to normalise directory paths
var chalk  = require('chalk'); // colorfull console output
var script = process.argv[2]; //'./server.js'; // this will be set dynamically via process.argv
var secret = Math.floor(Math.random() *10000000);
var child; // GLOBAL for child process
var exec = require('child_process').exec; // we run our script in child processes

var parent = path.resolve(__dirname + '../../package.json').replace('package.json', '');
console.log(chalk.red("PARENT >> "+parent))

// should we extract the list of files/dirs to ignore from .gitignore ...?
var ignore = ['.git','.gitignore', 'node_modules', 'coverage', '.vagrant', 'Vagrant'];

var dirs = []; // GLOBAL list (array) of all directories
var done = 0;  // we only start watching when done is Zero

// check if the arg is a file or directory
function checkisdir(arg, index, callback) {
  var fd = arg.split('/')[arg.split('/').length-1]; // just the file/dir
  fs.stat(arg, function(err, stat) {
    if(err) {
      console.log(err)
      callback();
    }
    // console.log(index +" | " + done +" | " + arg +" | "+fd +" | isFile: " + stat.isFile());
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
      checkisdir(file, 0, callback);
    }
    else {
      for(var i = files.length-1; i >= 0; i--) {
        var file = path.resolve(dir + '/' + files[i]);
         checkisdir(file, i, callback);
      }
    }
  });
}
// run the desired script as a child process
function runscript() {
  var run = false;
  child = exec('npm start'); // pass in the script here
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
    // var str = data.toString(), lines = str.split(/(\r?\n)/g);
    // console.log('> ' + lines[0]);
    console.log(chalk.cyan(data))
  });

  child.stderr.on('data', function(data) {
    if(!run) {
      var str = data.toString();
      if(str.search('EADDRINUSE') > -1 || str.search('events.js') > -1){
        console.log(chalk.red(">> Re-Starting: "+script)
          +" at " +chalk.green(new Date().toTimeString()));
        run = true;
      }
      else {
        console.log(data);
      }
    }
  });
  child.on('close', function(code) {
      console.log(chalk.yellow('>> Closing Child Process'));
  });

  child.on('uncaughtException', function(err) {
    console.log('ERROR:' + err);
    index();
  });
}

// watch all files in this directory and all sub-directories
function index() {
  dirs = [parent]; // always include CWD
  var run = false; // only fire re-start even once
  walk(__dirname, function() {
    if(done === 0){
      uniquedirs = dirs.filter(function(item, pos) {
        return dirs.indexOf(item) == pos;
      })
      // console.log(uniquedirs);
      runscript(); // boot the child script
      console.log(chalk.green("✓ Project Re-Indexed"));
      uniquedirs.map(function(dir){
        // watch ALL of the dirs!
        fs.watch(dir, function (event, filename) {
          if (filename) {
            if(!run){
              run = true;
              console.log(chalk.bgGreen.black(" " + filename +" " + event + "d "));
              sio.emit(secret, "Latest: " + filename +" "+event+"d");
              setTimeout(function(){
                kill(child.pid);
                return index();
              },10);
            }

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

// kill the existing child process before starting a new one:
var psTree = require('ps-tree');
// see: http://goo.gl/IatsO9
var kill = function (pid, signal, callback) {
  signal   = signal || 'SIGKILL';
  callback = callback || function () {};
  var killTree = true;
  if(killTree) {
    psTree(pid, function (err, children) {
      [pid].concat(
        children.map(function (p) {
            return p.PID;
        })
      ).forEach(function (tpid) {
        try { process.kill(tpid, signal) }
        catch (ex) { }
      });
      callback();
    });
  }
  else {
    try { process.kill(pid, signal) }
    catch (ex) { }
    callback();
  }
};


// start websocket server
var app = require('http').createServer();
var port = process.env.FASTER_PORT || 4242;
var io  = require('socket.io')(app);

app.listen(port);

io.on('connection', function(socket){
  var ua = socket.handshake.headers['user-agent'].split(' ');
  var agent = ua[ua.length-1];
  var client = socket.id +" " +chalk.blue(agent);
  console.log(chalk.green("Connected >> ") + client);

  socket.emit('message', 'hello from server');
  // var interval = setInterval(function(){
  //   var message = "ping from server: "+ new Date();
  //   io.emit('message', message);
  // }, 5000); // used in testing

  socket.on(secret, function(data){
    // console.log(chalk.green(data));
    socket.broadcast.emit('refresh', data);
  })

  socket.on("disconnect", function() {
    console.log(chalk.red("Refreshing >> ") + client);
    // clearInterval(interval);
  })
})

console.log(chalk.bgGreen.black(" >> Faster (App Reloader) Started on Port: "+port +" "));

var ioclient = require('socket.io-client');
var sio = ioclient.connect('http://localhost:'+port, {reconnect: true});
// setInterval(function(){
//   sio.emit('click', "SERVER Click "+ Math.random())
// },4000)

// index();
module.exports = index;
