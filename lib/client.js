(function () {

  // GLOCALS (Global to *this* file's Closure!)
  var green = 'url(http://i.imgur.com/Cp0ITNX.png)';
  var red   = 'url(http://i.imgur.com/WDddlnh.png)';
  var r, m, refresh, div, socket;

  var url  = window.location.href.split('?')[0]; // url without query string
  var pos = url.lastIndexOf(':'); // remove the port we are running the app on
  var furl = url.substring(0, pos) + ':4242'; // the FASTER URL
  var aurl = document.URL;                    // app url 

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
            cb(xmlhttp.responseText);
          } else {
            console.log(count);
            m.innerHTML = count;
            frequency = count * 200;
            // }
          }
        }
      }
      xmlhttp.send();
    },frequency);
  }

  var createfooter = function(){
    div = document.createElement("div");
    div.id = "fstr__";
    div.innerHTML = '<a id="fstr_refresh__" title="auto refresh"></a> <i id="fstr_msg__"></i>'
    document.body.appendChild(div);
  }

  var init = function(){
    r = document.getElementById("fstr_refresh__");
    m = document.getElementById("fstr_msg__");
    // console.log(r);
    r.onclick = function() {
      return toggle();
    };
    div.onclick = function() {
      return toggle();
    };
  }

  var toggle = function() {
    refresh = localStorage.getItem('fstr_refresh__');
    if(refresh === 'yes') {
      // console.log("switch to red")
      r.style.backgroundImage = red;
      refresh = 'no'
    } else {
      r.style.backgroundImage = green;
      refresh = 'yes'
    }
    localStorage.setItem('fstr_refresh__', refresh)
    console.log("Faster refresh: "+localStorage.getItem('fstr_refresh__'));
  }

  var enabled = function() {
    refresh = localStorage.getItem('fstr_refresh__');
    console.log("Faster Refresh: "+refresh);
    if(refresh === 'no') {
      r.style.backgroundImage = red;
    } else {
      localStorage.setItem('fstr_refresh__', 'yes')
      r.style.backgroundImage = green; // set initial state
      m.innerHTML = localStorage.getItem('fstr_msg__');
    }
  }

  var loadcss = function(){
    // var file = "https://rawgit.com/ideaq/faster/master/lib/style.css";
    var file = furl+"/style.css";
    var link = document.createElement( "link" );
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    document.body.appendChild( link );
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
    // socket.on('message', function(data) { // messaging functionality?
    //   // console.log(data);
    //   localStorage.setItem('fstr_msg__', data);
    //   m.innerHTML = data;
    // })

      socket.on('refresh', function(data) {
        m.innerHTML = data;
        localStorage.setItem('fstr_msg__', data);
        if(localStorage.getItem('fstr_refresh__') === 'yes') {
          socket.disconnect()
          ajaxpoll(aurl, function(){
            trysocketio(function(){
              m.innerHTML = "Server is Ready, Let's Refresh the Page!";
              location.reload(true);
            })
          })
        } else {
          console.log('refresh signal received: '+data);
        }
      })

    });
  }

  // console.log("Dev URL: "+url)
  if(aurl.search("localhost") > -1 || aurl.search('127.0') > -1 || aurl.search(':') > -1){
    ajaxpoll(aurl, function(){
      loadscript(function(){
        loadcss();
        createfooter();
        init();
        socketinit();
        enabled();
      });
    });
  }
}());
