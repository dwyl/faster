#!/usr/bin/env node
'use strict';
// when developing use /../ othewise we need to go up /node_modules/faster/bin/
var basedir = process.env.BASE || '/../../../';
require('../lib/')('/../');
