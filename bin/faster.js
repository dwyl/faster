#!/usr/bin/env node
'use strict';
// when developing use /../ othewise we need to go up /yourapp from /node_modules/faster/bin/
var basedir;
if(parseInt(process.env.DEV,10) === 1) {
  basedir = '/../';
} else {
  basedir = '/../../../';
}
// console.log("faster basedir: "+basedir);
require('../lib/')(basedir, function(child){
  // done.
});
