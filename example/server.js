var fs   = require('fs');
var path = require('path');
var PORT = process.env.PORT || 4000;

/**
 * index just reads the index.html file and sends it to client.
 * @param Object res - the HTTP response object which lets us
 * send ("end") the response to the client sending the content.
 */
var index = function(res) {
  fs.readFile(__dirname+'/index.html', function(err, data) {
    res.writeHead(200, {"Content-Type": "text/html"});
    if(err){
      return res.end(err);
    } else {
      return res.end(data.toString())
    }
  });
}

require('http').createServer(function (req, res) {
  console.log(req.url);

  if(req.url.search('.') > -1) {
    var u    = req.url.split('/');
    var file = u[u.length-1];

    if (file === 'style.css') {
      var style  = fs.readFileSync(
        path.resolve(__dirname+'/../lib/style.css'), "utf8"); // always fresh
      res.writeHead(200, { "Content-Type": "text/css", "etag": new Date().getTime() });
      return res.end(style);
    }
    else if (file === 'client.js') {
      var client = fs.readFileSync(
        path.resolve(__dirname+'/../lib/client.js'),"utf8");
      res.writeHead(200, { "Content-Type": "application/javascript", "etag": new Date().getTime() });
      return res.end(client);
    }
    else {
      return index(res);
    }
  } else {
    return index(res);
  }
}).listen(PORT);

console.log("Visit: http://" + require('../lib/lanip') + ":" + PORT);
console.log("Open it in a few browesers... ;-)")
