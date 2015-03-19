(function () {

  // GLOCALS (Global to *this* file's Closure!)
  var green = 'url(http://i.imgur.com/Cp0ITNX.png)';
  var red   = 'url(http://i.imgur.com/WDddlnh.png)';
  var r, m, refresh, div;

  var createfooter = function(){
    div = document.createElement("div");
    div.id = "fstr__";
    div.innerHTML = '<a id="fstr_refresh__" title="auto refresh"></a> <i id="fstr_msg__"></i>'
    document.body.appendChild(div);
    // console.log(div);
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
      // console.log("switch to green")
      r.style.backgroundImage = green;
      refresh = 'yes'
    }
    localStorage.setItem('fstr_refresh__', refresh)
    console.log("Faster refresh: "+localStorage.getItem('fstr_refresh__'));
  }

  var enabled = function() {
    refresh = localStorage.getItem('fstr_refresh__');
    console.log("boot refresh: "+refresh);
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
    var file = "/style.css";
    var link = document.createElement( "link" );
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    document.body.appendChild( link );
  }

  var loadscript = function(callback) {
    var head = document.getElementsByTagName('head')[0];
    var js   = document.createElement("script");
    js.type  = "text/javascript";
    js.src   = "https://cdn.socket.io/socket.io-1.3.4.js";
    js.onreadystatechange = callback;
    js.onload = callback; // http://stackoverflow.com/a/950146/1148249
    head.appendChild(js);
    // console.log(js);
  }
  var socketinit = function() {
    var socket = io('http://localhost:4242');

    // socket.on('message', function(data){
    //   // console.log(data);
    //   localStorage.setItem('fstr_msg__', data);
    //   m.innerHTML = data;
    // })

    socket.on('refresh', function(data) {
      m.innerHTML = data;
      // console.log(" >>>> " +data);
      localStorage.setItem('fstr_msg__', data);
      if(localStorage.getItem('fstr_refresh__') === 'yes') {
        // console.log('refreshing content '+data);
        socket.disconnect()
        setTimeout(function(){
          // socket.emit('click', "CLIENT is Refreshing Browser Window");
          document.location.reload(true);
        },1000)
      } else {
        console.log('refresh signal received: '+data);
      }
    })
  }

  var url = document.URL;
  // console.log("Dev URL: "+url)
  if(url.search("localhost") > -1 || url.search('127.0') > -1 || url.search(':') > -1){
    loadscript(function(){
      loadcss();
      createfooter();
      init();
      socketinit();
      enabled();
    });
  }
}());
