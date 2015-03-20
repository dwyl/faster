var fs    = require('fs');
var path  = require('path');
var test  = require('tape');
var chalk = require('chalk');

var S     = require('./setup');

// dummy functions:
var final = function(list) {
  console.log(">>>> final: "+list.length);
}
var cb    = function(list) {
  console.log(">>>> cb: " + list.length)
}
var kw    = function(fd, dirlist, counter, afterwalking) {
  console.log(">>>> kw: " + list.length)
}
//
// test(chalk.green("utils.isdir > Confirm " +S.rootdir +" IS a directory (Keep Walking)"), function(t){
//   S.setup(function() {
//     var utils = require('../lib/utils');
//     utils.isdir(S.rootdir, [], cb, function keepwalking(fd, dirlist) {
//       // console.log(" - - - - - - - - - - - - - - ");
//       // console.log(dirlist);
//       // console.log(" - - - - - - - - - - - - - - ");
//       t.equal(dirlist.length, 1, S.rootdir + " is defs a directory");
//       t.end();
//     }, final); // end utils.isdir
//   }) // end S.setup
// })
//
// test(chalk.green("utils.isdir > " +S.filename +" is NOT directory"), function(t){
//   var utils = require('../lib/utils');
//   utils.setcounter(1);
//   utils.isdir(S.filename, [], cb, kw, function callback(dirlist){
//     t.equal(dirlist.length, 0, S.filename + " is NOT a directory");
//     t.end();
//   }); // end utils.isdir
// })
//
// test(chalk.green("utils.isdir > " +S.rootdir +"/random.txt does not add anything to dirlist"), function(t) {
//   var utils = require('../lib/utils');
//   var nonexist = S.rootdir +"/random.txt";
//   utils.setcounter(1);
//   utils.isdir(nonexist, [], cb, kw, function(dirlist) {
//     t.equal(dirlist.length, 0 , nonexist+ " does NOT get added");
//     t.end();
//   }); // end utils.isdir
// })
//
//
// test(chalk.green("utils.isdir > check for a non-existent file (should not DIE!)"), function(t){
//   var nonexist = S.rootdir +"/random.txt";
//   var utils = require('../lib/utils');
//   utils.setcounter(1);
//   utils.isdir(nonexist, [], cb, kw, function(dirlist) {
//     // console.log(err)
//     t.equal(dirlist.length, 0 , nonexist+ " keep on truckin'!");
//     t.end();
//   }); // end utils.isdir
// })
//
//
// test(chalk.green("utils.isdir > ../.git should be IGNORED"), function(t){
//   var ignored = path.resolve(__dirname+"/../.git"); // this should be FOUND but IGNORED as "NOT" a dir
//   var utils = require('../lib/utils');
//   utils.setcounter(1);
//   utils.isdir(ignored, [], cb, kw, function(dirlist, counter ) {
//     // double check the .git dir actually exists
//     fs.stat(ignored, function(staterr,stat) {
//       t.equal(stat.isDirectory(), true, ignored+ " IS a directory but we are ignoring it!");
//     })
//
//     // t.equal(err, null, ignored+ " does exist");
//     t.equal(dirlist.length, 0, ignored+ " is ignored and treated as NOT a directory!")
//     t.end();
//   }); // end utils.isdir
// })
//
// test("utils.isdirhandler > does absolutely nothing (Like a Boss!)", function(t) {
//   var utils = require('../lib/utils');
//   var dirlist = [];
//   utils.isdir(S.filename, dirlist, utils.isdirhandler);
//   t.equal(dirlist.length, 0, "Nothing added.")
//   // t.equal(dirlist[0], S.rootdir, S.rootdir+" is the only item in dirlist")
//   t.end();
// })

test(chalk.cyan("utils.walk > " + __dirname), function(t) {
  var utils = require('../lib/utils');
  utils.setcounter(0);
  utils.walk(__dirname, [], function(dirlist) {
    console.log(dirlist);
    t.equal(dirlist.length, 6, __dirname+ " has so many child dirs...");
    t.end();
  }); // end utils.isdir
})

// test(chalk.green.bold("utils.walk > " + S.empty +" requires checking!"), function(t) {
//   var dirlist = [];
//   var utils = require('../lib/utils');
//   utils.walk(S.empty, dirlist, function(dirlist) {
//     t.equal(dirlist.length, 0, __dirname+ " has so many child dirs...");
//     t.end();
//   }); // end utils.isdir
// })

// test("utils.walk > appends " +S.filename +" to dirlist", function(t) {
//     // var empty = [];
//     // utils.isdirhandler(null, true, empty, function(dirlist) {
//       // t.equal(dirlist.length, 1, S.filename+ " added to dirlist ")
//
//     // });
//
//     // t.equal(err, null, ignored+ " does exist");
//     // t.equal(isdir, false, ignored+ " is ignored and treated as NOT a directory!")
//     // t.end();
//     setTimeout(function(){
//       S.teardown(function(){
//         console.log(S.filename + " removed");
//         t.end();
//       })
//     },500);
// })
