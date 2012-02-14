/*global YUI*/

(function () {
    'use strict';

    YUI().use('node', 'panel', 'dd-plugin', function (Y) {
        Y.on('domready', function (e) {
            var dnode, EventEmitter, em, emit;

            dnode = require('dnode');
            EventEmitter = require('events').EventEmitter;

            Y.one('#btnStart').on('click', function (event) {
                dnode.connect(function (chat, conn) {
                    var panel, bodyHtml;

                    bodyHtml = '<div style="height: 80%; overflow: auto;"' +
                        ' id="output' + conn.id + '"></div>' +
                        '<div style="height: 20%;">' +
                        '<input id="input' + conn.id +
                        '" type="text" /></div>';

                    panel = new Y.Panel({
                        headerContent: 'chat window',
                        bodyContent: bodyHtml,
                        width: 250,
                        height: 200,
                        zIndex: 5,
                        centered: false,
                        modal: false,
                        visible: false,
                        render: false,
                        buttons: [
                            {
                                value: 'X',
                                action: function (e) {
                                    conn.end();
                                    this.hide();
                                },
                                section: Y.WidgetStdMod.HEADER
                            }
                        ]
                    }).plug(Y.Plugin.Drag, { handles: ['.yui3-widget-hd'] })
                        .render();

                    panel.show();

                    em = new EventEmitter();
                    em.on('message', function (msg) {
                        var node = Y.Node.create('<div></div>');
                        node.setContent(msg);
                        Y.one('#output' + conn.id)
                            .append(node);
                    });

                    emit = em.emit.bind(em);
                    chat.login(Y.one('#name').get('value') || 'guest', emit);

                    Y.one('#input' + conn.id).on('keydown', function (event) {
                        // 13 is keycode for ENTER
                        if (event.keyCode === 13) {
                            chat.sendMessage(Y.one('#input' + conn.id)
                                             .get('value'));
                            Y.one('#input' + conn.id).set('value', '');
                        }
                    });
                });
            });
        });
    });

}());