#Simple chat using [node.js](http://nodejs.org)

Just to play with node.js I wrote this very simple chat.

It consists of a server (`server.js`) which manages the chat.
Then there is a command line interface client (`client.js`)
and a web-client (`index.html`).

The command line client simply reads a message (one line)
from stdin and sends it to all other clients.
Received messages are written to stdout.

The web-client uses [jQuery](http://jquery.org) with
[this](http://fstoke.me/jquery/window/) window plugin
to provide chat windows.

##INSTALLATION

* Install [node.js](http://nodejs.org)
* Install [npm](http://npmjs.org)
* Install the required libraries:
    * `npm install dnode`
    * `npm install connect`
    * `npm install browserify`
    * `npm install lazy`
* Clone the repository: `git clone git://github.com/patsp/node-chat.git`

##USAGE

Start the server...

        $ node server.js

Then run a client form the command line...

        $ node client.js

and/or open the browser at `localhost:8080`, enter a name and
start the chat to use the web-client.

