(function () {

  // GLOCALS (Global to *this* file's Closure!)
  var socket; // the connection to the Socket.IO server
  var aurl = document.URL;          // url of the main application
  var url  = aurl.split('?')[0];    // url without query string
  var pos  = url.lastIndexOf(':');  // strip port main app is running the app on
  var furl = url.substring(0, pos) + ':4242'; // the FASTER (Socket.IO) URL

  function ajaxpoll(url, cb) { // http://stackoverflow.com/questions/8567114
    var count = 0;
    var frequency = 50; // polling frequency in miliseconds
    var interval = setInterval(function(){
      count++;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", url, true);
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 ) {
          if(xmlhttp.status === 200) {       // only when the server is ready
            clearInterval(interval);
            cb(xmlhttp.responseText);        // callback with the responseText
          } else {
            console.log(count);
            frequency = count * 200;
          }
        }
      }
      xmlhttp.send();
    },frequency);
  }


  var trysocketio = function(cb) {
    var stilltrying = setInterval(function(){
      try {
        socket = io(furl);
        clearInterval(stilltrying);
        cb();
      } catch (e) {
        console.log(e);
      }
    },50);
  }

  var loadscript = function(callback) {
    var head = document.getElementsByTagName('head')[0];
    var js   = document.createElement("script");
    js.type  = "text/javascript";
    // js.src   = "https://cdn.socket.io/socket.io-1.3.4.js"; // CDN
    js.src = furl+"/socket.io.js";
    js.onreadystatechange = callback;
    js.onload = callback; // http://stackoverflow.com/a/950146/1148249
    head.appendChild(js);

  }
  var socketinit = function() {
    trysocketio(function(){
      console.log("Faster Socket.IO Connected to: "+furl);
      socket.on('refresh', function(data) {
        if(localStorage.getItem('fstr_refresh__') === 'yes') {
          socket.disconnect()
          ajaxpoll(aurl, function(){
            trysocketio(function(){
              location.reload(true);
            })
          })
        } else {
          console.log('refresh signal received: '+data);
        }
      })

    });
  }

  if(aurl.search(':') > -1){
    localStorage.setItem('fstr_refresh__', 'yes')
    ajaxpoll(aurl, function(){
      loadscript(function(){
        socketinit();
      });
    });
  }
}());
