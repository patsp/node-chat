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
var Lazy = require('lazy');

var DEFAULT_PORT = 8081;

var dnode = DNode.connect(DEFAULT_PORT, function (chat, conn) {
    var em = new EventEmitter;
    em.on('error', function (err) {
        console.log('error occured: ' + err);
    });
    em.on('message', function (msg) {
        console.log(msg);
    });

    var emit = em.emit.bind(em);
    chat.login(process.argv[2] || 'guest', emit);

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    Lazy(process.stdin)
        .lines
        .map(String)
        .filter(function (line) {
            if (line === 'exit') {
                conn.end();
                return false;
            }
            return true;
        })
        .forEach(function (line) {
            chat.sendMessage(line);
        });

    conn.on('end', function () {
        process.stdin.pause();
    });

});
