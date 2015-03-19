![rocket turtle](http://i.imgur.com/bT7uPHE.png)

# faster

Helps you ***develop*** node.js web apps/sites ***faster***
by ***automatically re-loading*** any page,  
in ***all connected browsers*** each time ***any file*** in your project is ***updated***.


## Why?

We needed a *simpler* way of reloading the "page" when
files (views/styles/data) changes in our project.  
See: https://github.com/ideaq/time/issues/81

So, instead of trying to force an *existing* ***general purpose*** tool
to do the thing that we wanted,  
we decided to write our own ***specific*** script.

## What?


The ***simplest*** way to ensure the page(s) on *all* connected devices (*live*) ***re-load***  
when ever ***any file*** *or* ***directory*** is ***updated*** (created, changed or deleted) in the project.

![faster diagram](http://i.imgur.com/xXEbnvm.png)

### Key Benefits

+ ***Watches all directories*** *and* ***sub-directories*** (*recursively*) for ***any change***
+ Responds to *any change* in the files (create, update, delete, re-name.)
+ ***Notifies all connected clients*** there has been a change so they can ***re-fresh***
their content.
+ Boots *separate* WebSocket server (from your project) so no attaching required
(no conflict with existing scripts)
+ Runs the script defined in your `npm run` command as normal
+ Automatically ***ignores*** .**gitignore**, .**git**
and all files in **/node_modules**  (useful when your project has  
  dependencies you don't expect to change *while* you are running your dev server)


## Usage

Install and save a *development dependency*:

```sh
npm install faster --save-dev
```
Then add the following line to the `scripts` section of your `package.json`.

```js
"faster":"./node_modules/bin/faster.js"
```
*and* add this script to the main/layout template in your project:

```html
<script src="https://rawgit.com/ideaq/faster/master/lib/client.js"></script>
```

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
    "faster": "./node_modules/bin/faster.js"
  }
}
```

#### No Global Install Required

We hate it when module authors *require* ***global*** installation,
so we encourage you to install this module *locally* to your app


#### Development *ONLY*

*Please* do not use this in Production.
(The Socket.io server on port 4242)

To *prevent* ***accidental*** running of this script in Prod,
the client script only works when the `url` *matches* ***localhost*** or ***127.0.0.1***.

#### *NOT* "*General Purpose*" (Yet!)

Right now, this script is *very* specific

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
+ **Meteor** has live reloading https://github.com/meteor/meteor
+ **Watch**: https://www.npmjs.com/package/watch  
(has lots of good ideas and code from *many* great contributors ...
  does *half* the job we want, but does not refresh connected devices/browsers)
+ Walk: https://github.com/coolaj86/node-walk
+ Refresh: https://github.com/kinncj/refresh/blob/master/lib/monitor.js

### Background Reading

+ Testing Socket.io: http://swizec.com/blog/testing-socket-io-apps/swizec/5625
+ Socket.io: https://github.com/Automattic/socket.io-client

## tl;dr

We tried using [**nodemon**](https://github.com/ideaq/faster/issues/1)
but found it lacking in two key areas:

**a**. New files/folders added to the project were not watched.  
**b**. We still had to *manually* refresh each connected client each time.
