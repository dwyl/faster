var fs    = require('fs');
var path  = require('path');
var S     = require('./setup');
var utils = require('../lib/utils');
var test  = require('tape');

// function next(list){
//   console.log("next: "+list.length);
// }

test("utils.isdir > Confirm " +S.rootdir +" IS a directory", function(t){
  S.setup(function() {
    utils.isdir(S.rootdir, [], 0, function(err, isdir){
      t.equal(err, null, "no errors");
      t.equal(isdir, true, S.rootdir + " is defs a directory");
      t.end();
    }, S.next); // end utils.isdir
  }) // end S.setup
})

test("utils.isdir > " +S.filename +" is NOT directory", function(t){
  utils.isdir(S.filename, [], 0, function(err, isdir){
    t.equal(err, null, "no errors");
    t.equal(isdir, false, S.filename + " is NOT a directory");
    t.end();
  }, S.next); // end utils.isdir
})

test("utils.isdir > " +S.rootdir +"/random.txt THROWS error", function(t){
  var nonexist = S.rootdir +"/random.txt";
  utils.isdir(nonexist, [], 0, function(err, isdir) {
    // console.log(err)
    t.equal(err.code, 'ENOENT', nonexist+ " does NOT exist");
    t.end();
  }, S.next); // end utils.isdir
})

test("utils.isdir > ../.git should be IGNORED", function(t){
  var ignored = path.resolve(__dirname+"/../.git"); // this should be FOUND but IGNORED as "NOT" a dir
  utils.isdir(ignored, [], 0, function(err, isdir) {

    // double check the .git dir actually exists
    fs.stat(ignored, function(staterr,stat) {
      t.equal(stat.isDirectory(), true, ignored+ " IS a directory but we are ignoring it!");
    })

    t.equal(err, null, ignored+ " does exist");
    t.equal(isdir, false, ignored+ " is ignored and treated as NOT a directory!")
    t.end();
  }, S.next); // end utils.isdir
})


test("utils.isdirhandler > appends " +S.rootdir +" to dirlist", function(t) {
  var empty = [];
  var after = S.next;
  utils.isdir(S.rootdir, empty, 0, function(err, isdir, dirlist, after) {
    utils.isdirhandler(err, isdir, dirlist, function(dirlist){
      t.equal(dirlist.length, 1, dirlist[0]+" was added to dirlist")
      t.equal(dirlist[0], S.rootdir, S.rootdir+" is the only item in dirlist")
      t.end();
    }); // utils.isdirhandler
  }, S.next); // end utils.isdir
})


test("utils.isdirhandler > appends " +S.filename +" to dirlist", function(t) {
  var empty = [];
  utils.isdir(S.filename, empty, 0, function(err, isdir, dirlist, next) {
    // console.log(err)
    utils.isdirhandler(err, isdir, dirlist, function(dirlist) {
      t.equal(dirlist.length, 0, S.filename+ " NOT added to dirlist ")
      t.end();
    }, S.next);

    // t.equal(err, null, ignored+ " does exist");
    // t.equal(isdir, false, ignored+ " is ignored and treated as NOT a directory!")
    // t.end();
    setTimeout(function(){
    S.teardown(function(){
      console.log(S.filename + " removed");
    })
    },500);
  }); // end utils.isdir
})
