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
var lanip = 'http://'+ip
	var CDNScript = "https://rawgit.com/ideaq/faster/master/lib/client.js";

var bootmsg = function(parentdir) {
	 // intentional blank line
	var msg = "                                       ";
	msg = msg + msg + "\n"; // duplicate the blank line
	msg += " >> " + chalk.bold("Faster ") + "(Reloader) ";
	msg += " Version "+pak.version +"  ";
	msg += chalk.bold(" Started ") + "on "+ iourl;
	msg += "   \n";
	msg += " >> Faster is watching "+chalk.bold(parentdir);
	msg += " for changes. \n"
	msg += " >> " + chalk.bold("Don't Forget ") + "to add the ";
	msg += chalk.bold("Faster Client") + " script to ";
	msg += chalk.bold("your HTML Template \n");
	msg += " <script src='" + CDNScript +"'></script> \n"
	// msg += chalk.bold.italic.inverse(" OR ");
	// msg += " <script src='" + iourl + "/client.js'></script> (LOCAL)\n";
	msg += " Access your app in the browser using "
	msg += chalk.italic.inverse(" LAN IP Address: " +lanip +" ") + " \n";

	console.log(chalk.bgGreen.black(msg));
}

module.exports = bootmsg;