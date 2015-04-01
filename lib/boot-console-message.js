/**
 * Boot Console Message prints usefull information to the console when Faster boots
 * we use chalk to make it colorful and highlight specific info.
 * see: https://github.com/ideaq/faster/issues/41 for an example
 */
var chalk  = require('chalk'); // colorfull console output
var pak = require('../package.json');
var ip = require('./lanip'); // the LAN IP Address
var port   = process.env.FASTER_PORT || 4242;
var iourl = 'http://'+ip+':'+port;
// var appport = process.env.PORT || 8000
var appurl = 'http://'+ip //+':'+ appport;
var msg = "                                       "; // blank line
var msg = msg + msg + "\n";
msg += " >> " + chalk.bold("Faster ") + "(App Reloader) ";
msg += "Version "+pak.version +"  ";
msg += chalk.bold("Started ") + "on "+ iourl;
msg += "   \n";
msg += " >> " + chalk.bold("Don't Forget ") + "to Add the ";
msg += chalk.bold("Faster Client") + " script to ";
msg += chalk.bold("your HTML Template \n");
var CDNScript = "https://rawgit.com/ideaq/faster/master/lib/client.js";
msg += " e.g: <script src='" + CDNScript +"'></script> (CDN) \n"
msg += chalk.bold.italic.inverse(" OR ");
msg += " <script src='" + iourl + "/client.js'></script> (LOCAL)\n";
msg += " Access your app in the browser using "
msg += chalk.italic.inverse(" LAN IP Address: " +appurl +" ") + " \n";
console.log(chalk.bgGreen.black(msg));