/*global $*/

(function () {
    'use strict';

    $(document).ready(function () {
        var dnode, EventEmitter, em, emit;

        dnode = require('dnode');
        EventEmitter = require('events').EventEmitter;

        $('#btnStart').click(function (event) {
            dnode.connect(function (chat, conn) {
                $.window({
                    title: "chat window",
                    content: '<div style="height: 80%; overflow: auto;"' +
                        ' id="output' + conn.id + '"></div>' +
                        '<div style="height: 20%;">' +
                        '<input id="input' + conn.id +
                        '" type="text" /></div>',
                    onClose: function (wnd) {
                        conn.end();
                    }
                });

                em = new EventEmitter();
                em.on('message', function (msg) {
                    $('#output' + conn.id)
                        .append($('<div></div>').text(msg));
                });

                emit = em.emit.bind(em);
                chat.login($('#name').val() || 'guest', emit);

                $('#input' + conn.id).keydown(function (event) {
                    // 13 is keycode for ENTER
                    if (event.keyCode === 13) {
                        chat.sendMessage($('#input' + conn.id).val());
                        $('#input' + conn.id).val('');
                    }
                });
            });
        });
    });
}());