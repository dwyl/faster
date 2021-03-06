# faster

Helps you ***develop*** node.js web apps/sites ***faster***
by ***automatically re-loading*** any page,  
in ***all connected browsers*** each time ***any file*** in your project is ***updated***.

![rocket turtle](http://i.imgur.com/bT7uPHE.png)

[![Build Status](https://travis-ci.org/dwyl/faster.svg)](https://travis-ci.org/dwyl/faster)
[![codecov](https://codecov.io/gh/dwyl/faster/branch/master/graph/badge.svg)](https://codecov.io/gh/dwyl/faster)
[![npm version](https://badge.fury.io/js/faster.svg)](http://badge.fury.io/js/faster)
[![Node.js Version](https://img.shields.io/node/v/terminate.svg?style=flat)](http://nodejs.org/download)
[![Dependency Status](https://david-dm.org/dwyl/faster.svg)](https://david-dm.org/dwyl/faster)


## *Why*?

We need a *simpler* way of reloading the "page" when
files (views/styles/etc) change in our project.  
See: [time/81](https://github.com/ideaq/time/issues/81)

So, instead of trying to force an *existing* ***general purpose*** tool
to do the thing that we wanted,  
we decided to write our own ***specific*** script.

## *What*?

The ***simplest*** way to ensure the page(s) on *all* connected devices (*live*) ***re-load***  
when ever ***any file*** *or* ***directory*** is ***updated*** (created, changed or deleted) in the project.

![faster diagram](http://i.imgur.com/xXEbnvm.png)

### Key Benefits

+ ***Watches all directories*** *and* ***sub-directories*** (*recursively*) for ***any change***
+ Responds to *any change* in the files (create, update, delete, re-name.)
+ ***Notifies all connected clients*** there has been a change so they can ***re-fresh***
their content.
+ Boots *separate* WebSocket server (from your project) so no attaching required
(no conflict with existing scripts)
+ Runs the script defined in your `npm start` script/command as normal
+ Automatically ***ignores*** .**gitignore**, .**git** and all files in **/node_modules**  
(useful when your project has dependencies you don't expect to change *while* you are running your dev server)


## *How*? [![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Using this module in ***4 easy steps***

### 1. Install from NPM

Install and save a *development dependency*:

```sh
npm install faster --save-dev
```

### 2. Add the `faster` script entry to your `package.json`

Add the following line to the `scripts` section of your `package.json`.

```js
"faster":"./node_modules/faster/bin/faster.js"
```
### 3. Add the `client.js` script entry to your Template file

*and* add this script to the main/layout template in your project:

```html
<script src='https://rawgit.com/dwyl/faster/master/lib/client.js'></script>
```

***Note***: *if* you ***prefer*** to ***run Faster*** 100% ***locally*** you will
need to load the script in your template using your **LAN IP Address**:

```html
<script src='http://<YOUR.LAN.IP.ADDRESS>:4242/client.js'></script>
```

*Handily*, ***Faster*** will inform you what your LAN IP is when you boot it!
(Just see the **Terminal**)

But... because your LAN IP address will *change* if you don't have *fixed*
IP assignment (i.e. you are using a Laptop on WiFi...)
you will need to update your html/template each time your IP changes...
This can get *tedious* so ***we recommend*** using the ***CDN script*** above
in your ***template file***.


### 4. Run *Faster*

Now you can run the following command on your local machine:

```sh
npm run faster
```

### Notes

#### *faster* *Expects* you to have a `start` script in package.json

If you do not have an [**npm start**](https://docs.npmjs.com/cli/start) script,
add one to your package.json *now*!  
(`npm start` is how other developers will run your project).

Example package.json `start` entry:
```js
{
  "name" : "your-project",
  "scripts" : {
    "start" : "node server.js",
    "faster": "./node_modules/faster/bin/faster.js"
  }
}
```

#### We *Recommend* Accessing Your App by the *LAN IP Address*

While we ***recommend*** using the **CDN-hosted** ***client.js*** in your
template file (see **step 3** *above*),  
if you want to ***test*** your web application on ***multiple devices***
e.g. in your office/workspace's **Device Lab**

![Device Lab](http://i.imgur.com/bnDedwg.jpg)

You will need to use the **LAN IP Address** to access the app from the devices.  
Again, helpfully, ***Faster*** tells what the **LAN IP Address is
when you boot your app using the `npm run faster` command:

![faster-boot-console-explain-basedir](https://cloud.githubusercontent.com/assets/194400/6909776/a6d8573e-d741-11e4-8582-5606ff80a5ca.png)˜


#### *No Global Install* Required

We *hate* it when module authors *forece* ***global*** installation,
so we encourage you to install this module *locally* to your app.  
Save it as a
[**devDependency**](http://stackoverflow.com/a/22004559/1148249)
so other developers know that ***faster*** is *useful*
when they try to contribute to your project.

#### Development *ONLY*

*Please* do not use this in Production.
(The Socket.io server on port 4242)

To *prevent* ***accidental*** running of this script in Prod,˜
the client script only works when the `url` *matches* ***localhost*** or ***127.0.0.1***.

#### *NOT* "*General Purpose*" (Yet!)

Right now, this script is *very* specific

#### Windows Support ... *Untested*!

> We have *not* tried this on Windows.
> If anyone wants to try, please
```sh
git clone https://github.com/dwyl/faster.git && cd faster
npm install && npm test
```
> and let us know what you see...!

<br />
<hr />
<br />

## Research

### *Partial* Alternatives

+ **Nodemon** the granddad of node file watch-and-reloaders: https://github.com/remy/nodemon  
(does not restart your script when *any* file is updated or *new* files created...)
+ **node-livereload**:
https://github.com/napcs/node-livereload
(we had a look at, but did not fit our needs ... uses *polling*)
+ **Watch**: https://www.npmjs.com/package/watch  
(has lots of good ideas and code from *many* great contributors ...
  does *half* the job we want, but does not refresh connected devices/browsers)
+ Walk: https://github.com/coolaj86/node-walk
+ Refresh: https://github.com/kinncj/refresh/blob/master/lib/monitor.js

### Inspiration

+ In past we've used **Meteor** which has live reloading https://github.com/meteor/meteor
(sadly, its a "Black Box" part of their "Secret Sauce" so we had to write our own...)

### Background Reading

+ Testing Socket.io: http://swizec.com/blog/testing-socket-io-apps/swizec/5625
+ Socket.io: https://github.com/Automattic/socket.io-client

## tl;dr

We tried using [**nodemon**](https://github.com/dwyl/faster/issues/1)
but found it lacking in two key areas:

**a**. New files/folders added to the project were not watched.  
**b**. We still had to *manually* refresh each connected client each time.
