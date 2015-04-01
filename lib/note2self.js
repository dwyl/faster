/**
 * Note2Self prints usefull information to the console when faster boots
 * see: https://github.com/ideaq/faster/issues/41
 */
var chalk  = require('chalk'); // colorfull console output
var pak = require('../package.json');
var ip = require('./lanip'); // the LAN IP Address
var port   = process.env.FASTER_PORT || 4242;
var iourl = 'http://'+ip+':'+port;
// var appport = process.env.PORT || 8000
var appurl = 'http://'+ip //+':'+ appport;

var note2self = "                                       "; // blank line
var note2self = note2self + note2self + "\n";
note2self += " >> " + chalk.bold("Faster ") + "(App Reloader) ";
note2self += "Version "+pak.version +"  ";
note2self += chalk.bold("Started ") + "on "+ iourl;
note2self += "   \n";
note2self += " >> " + chalk.bold("Don't Forget ") + "to Add the ";
note2self += chalk.bold("Faster Client") + " script to ";
note2self += chalk.bold("your HTML Template \n");
var CDNScript = "https://rawgit.com/ideaq/faster/master/lib/client.js";
note2self += " e.g: <script src='" + CDNScript +"'></script> (CDN) \n"
note2self += chalk.bold.italic.inverse(" OR ");
note2self += " <script src='" + iourl + "/client.js'></script> (LOCAL)\n";
note2self += " Access your app in the browser using "
note2self += chalk.italic.inverse(" LAN IP Address: " +appurl +" ") + " \n";
console.log(chalk.bgGreen.black(note2self));