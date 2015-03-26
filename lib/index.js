var fs     = require('fs');
var path   = require('path');  // used to normalise directory paths
var chalk  = require('chalk'); // colorfull console output
var red = chalk.red, green = chalk.green, cyan = chalk.cyan;
var script = process.argv[2]; //'./server.js'; // this will be set dynamically via process.argv
var secret = Math.floor(Math.random() *10000000);
var child; // GLOBAL for child process
var exec   = require('child_process').exec; // we run our script in child processes

var parent = path.resolve(__dirname + '../../package.json').replace('package.json', '');
console.log(red("PARENT Directory >> "+parent))

var ignore = require('ignored')(__dirname+'/../.gitignore'); // https://github.com/nelsonic/ignored
var listdirs = require('listdirs'); // https://www.npmjs.com/package/listdirs
var dirs = []; // GLOBAL list (array) of all directories

// run the desired script as a child process
function child() {
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

  child.on('exit', function(code) {
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
  var run = false; // only allow one re-start event
  listdirs(parent, function dirslisted(err, dirs) {
    uniquedirs = dirs.filter(function(item, pos) {
      return dirs.indexOf(item) == pos;
    })
    // console.log(uniquedirs);
    child(); // boot the child script
    console.log(chalk.green("✓ Project Re-Indexed"));
    uniquedirs.forEach(function(dir){
      // watch ALL of the dirs!
      fs.watch(dir, function (event, filename) {
        if (filename) {
          if(!run && ignore.indexOf(filename) === -1){
            run = true;
            console.log(chalk.bgGreen.black(" " + filename +" " + event + "d "));
            sio.emit(secret, ">> " + filename +" "+event+"d");
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
  }); // end listdirs
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

// start websocket SERVER
var app = require('http').createServer();
var port = process.env.FASTER_PORT || 4242;
var io  = require('socket.io')(app);
app.listen(port);

io.on('connection', function(socket){
  var ua = socket.handshake.headers['user-agent'].split(' ');
  var agent = ua[ua.length-1];
  var client = socket.id +" " +chalk.cyan(agent);
  console.log(chalk.green("Device/Browser Connected: ") + client);

  socket.emit('message', chalk.red('Faster WebSocket Server Says Howdy!') );
  // var interval = setInterval(function(){
  //   var message = "ping from server: "+ new Date();
  //   io.emit('message', message);
  // }, 5000); // used in testing

  socket.on(secret, function(data){
    // console.log(chalk.green(data));
    socket.broadcast.emit('refresh', data);
  })

  socket.on("disconnect", function() {
    console.log(chalk.red("Refreshing Device/Browser >> ") + client);
    // clearInterval(interval);
  })
})

console.log(chalk.bgGreen.black(" >> Faster (App Reloader) Started on Port: "+port +" "));

// start SocketIO CLIENT so we can communicate internally
var ioclient = require('socket.io-client');
var sio = ioclient.connect('http://localhost:'+port, {reconnect: true});
// setInterval(function(){
//   sio.emit('click', "SERVER Click "+ Math.random())
// },4000)

// index();
module.exports = index;
