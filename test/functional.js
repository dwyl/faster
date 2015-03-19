var fs    = require('fs');
var path  = require('path');
var S     = require('./setup');
var utils = require('../lib/utils');
var test  = require('tape');

test("utils.isdir > Confirm " +S.rootdir +" IS a directory", function(t){
  S.setup(function() {
    utils.isdir(S.rootdir, function(err, isdir){
      t.equal(err, null, "no errors");
      t.equal(isdir, true, S.rootdir + " is defs a directory");
      t.end();
    }); // end utils.isdir
  }) // end S.setup
})

test("utils.isdir > " +S.filename +" is NOT directory", function(t){
  utils.isdir(S.filename, function(err, isdir){
    t.equal(err, null, "no errors");
    t.equal(isdir, false, S.filename + " is NOT a directory");
    t.end();
  }); // end utils.isdir
})

test("utils.isdir > " +S.rootdir +"/random.txt THROWS error", function(t){
  var nonexist = S.rootdir +"/random.txt";
  utils.isdir(nonexist, function(err, isdir) {
    // console.log(err)
    t.equal(err.code, 'ENOENT', nonexist+ " does NOT exist");
    t.end();
  }); // end utils.isdir
})


test("utils.isdir > ../.git should be IGNORED", function(t){
  var ignored = path.resolve(__dirname+"/../.git"); // this should be FOUND but IGNORED as "NOT" a dir
  utils.isdir(ignored, function(err, isdir) {

    fs.stat(ignored, function(staterr,stat){
      t.equal(stat.isDirectory(), true, ignored+ " IS a directory but we are ignoring it!");
    })

    t.equal(err, null, ignored+ " does exist");
    t.equal(isdir, false, ignored+ " is ignored and treated as NOT a directory!")
    t.end();
    // setTimeout(function(){
    S.teardown(function(){
      console.log(S.filename + " removed");
    })
    // },500);
  }); // end utils.isdir
})
