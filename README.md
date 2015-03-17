![rocket turtle](http://i.imgur.com/bT7uPHE.png)

# faster
Get feedback faster.



## Why?

We needed a *simpler* way of reloading the "page" when
files (views/styles/data) changes in our project.

See: https://github.com/ideaq/time/issues/81

## What?

![faster diagram](http://i.imgur.com/xXEbnvm.png)

The **simplest** way of re-loading pages on connected devices.


## Research

+ Nodemon: https://github.com/remy/nodemon
+ https://github.com/napcs/node-livereload (uses polling)
+ https://github.com/meteor/meteor
+ Watch: https://www.npmjs.com/package/watch
(does *half* the job we want, but does not refresh connected devices/browsers)
+ Walk: https://github.com/coolaj86/node-walk
+ Refresh: https://github.com/kinncj/refresh/blob/master/lib/monitor.js
+ Testing Socket.io: http://swizec.com/blog/testing-socket-io-apps/swizec/5625
+ Socket.io: https://github.com/Automattic/socket.io-client
