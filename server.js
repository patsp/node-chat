/*
 * Copyright (c) 2011 Patrick Spettel
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 */

var DNode = require('dnode');
var EventEmitter = require('events').EventEmitter;
var connect = require('connect');

var obj = function (link) {
    var F = function () {};
    F.prototype = link;
    return new F();
};

var DEFAULT_PORT = 8081;
var DEFAULT_WEB_PORT = 8080;

var chat = obj(new EventEmitter());
// the message buffer stores the latest MAX_MSG_BUF_LEN messages
// -> if a new user joins he gets the latest messages, if there are any.
chat.MAX_MSG_BUF_LEN = 10;
chat.msgBuffer = [];
chat.newMessage = function (userName, msg) {
    var completeMessage = userName + ': ' + msg;
    this.emit('message', completeMessage);
    if (this.msgBuffer.length >= chat.MAX_MSG_BUF_LEN) {
        this.msgBuffer.shift();
    }
    this.msgBuffer.push(completeMessage);
};
chat.users = {};

var webserver = connect.createServer();
webserver.use(connect.static(__dirname));
webserver.use(require('browserify')({ require : 'dnode' }));
webserver.listen(DEFAULT_WEB_PORT);

DNode(function (client, conn) {
    this.login = function (name, emitCallback) {
        if (conn.id in chat.users) {
            emitCallback('error', 'internal error');
        } else {
            chat.users[conn.id] =
                { 'name': name || 'guest', 'emitCallback': emitCallback };
            chat.on('message', emitCallback.bind(null, 'message'));
            chat.on('error', emitCallback.bind(null, 'error'));
            conn.on('end', function () {
                delete chat.users[conn.id];
                chat.removeListener('message', emitCallback);
                chat.removeListener('error', emitCallback);
                chat.newMessage('system', 'user ' + name + ' left.');
            });

            // send the latest messages to this user
            chat.msgBuffer.forEach(function (msg) {
                emitCallback('message', msg);
            });

            chat.newMessage('system', 'user ' + name + ' joined.');
        }
    };
    this.sendMessage = function (msg) {
        chat.newMessage(chat.users[conn.id].name, msg);
    };
}).listen(DEFAULT_PORT).listen(webserver);

console.log('chat listening on localhost:8081');
console.log('webchat listening on http://localhost:8080/');

// debugging output every 10 secs
setInterval(function () {
    console.log(chat.users);
}, 10000);