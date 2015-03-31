var test  = require('tape');
var chalk = require('chalk');
var red = chalk.red, green = chalk.green, cyan = chalk.cyan;
var exec = require('child_process').exec;
var port = process.env.FASTER_PORT || 4242;
var secret = process.env.FASTER_SECRET || '1234'; // don't publish this
var terminate = require('terminate'); // knew this would come in handy! ;-)
var fs = require('fs');
// start SocketIO CLIENT so we can listen for the restart event
var ioclient = require('socket.io-client');
// var sio;
var socket;

var faster = require('../lib/');
var basedir = '/../';

// test(cyan('Init Faster Without Callback'), function(t){
//
// });

test(cyan('Run Faster. Update a File. Listen for Re-Start Event. Close'), function(t){
  setTimeout(function(){
    faster(basedir, function(child){
      t.true(parseInt(child.pid, 10) > 0, green("✓ Child Process Running ") + cyan(child.pid))
      setTimeout(function(){
        socket = require('socket.io-client')('http://localhost:'+port);
        console.log(chalk.bgYellow.red.bold(" Socket.io Client Started "))
        socket.on('refresh', function(data) {
          console.log(chalk.bgYellow.red(data));
        });
      }, 500);

      var filename = __dirname + "/hai.txt";
      var time = new Date().getTime();
      fs.writeFile(filename, time, function(err){
        if(err) {
          console.log(err);
        }
        // socekt should receive a message here...
        // t.end();
      });
      // update npm-debug.log
      filename = __dirname + "/setup/npm-debug.log";
      fs.writeFile(filename, time, function(err){
        if(err) {
          console.log(err);
        }

        // socekt should receive a message here...
        t.end();
      });
    })
  },2000)
});

var Wreck = require('wreck');

test(cyan('Access Faster Server style.css and client.js'), function(t){
  Wreck.get('http://localhost:'+port+'/', function (err, res, payload) {
    t.equal(payload, '404', "✓ 404");
  });
  Wreck.get('http://localhost:'+port+'/style.css', function (err, res, payload) {
    t.true(payload.indexOf('#fstr_refresh__') > -1, "✓ style.css loaded");
  });
  Wreck.get('http://localhost:'+port+'/client.js', function (err, res, payload) {
    t.true(payload.indexOf('function') > -1, "✓ client.js loaded");
  });
  Wreck.get('http://localhost:'+port+'/socket.io.js', function (err, res, payload) {
    t.true(payload.indexOf('function') > -1, "✓ client.js loaded");
  });
  Wreck.get('http://localhost:'+port+'/fail.html', function (err, res, payload) {
    // console.log(payload);
    t.equal(payload, '404', "✓ fail should 404");
    // t.end()
  });
  var ip = faster.ip;
  t.true(ip.length > 8, green("✓ IP Address is: ")+ip);
  t.end();
});

test(cyan('Shut Down Faster'), function(t){
  setTimeout(function() {
    socket.disconnect();
    faster.terminate(function(err, done){
      t.true(done, green("✓ Cleanup Complete"))
      t.end();
    });
  },2000);
});
