System.register(['../common/utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1;
    // we have to patch the instance since the proto is non-configurable
    function apply(_global) {
        var WS = _global.WebSocket;
        // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
        // On older Chrome, no need since EventTarget was already patched
        if (!_global.EventTarget) {
            utils_1.patchEventTargetMethods(WS.prototype);
        }
        _global.WebSocket = function (a, b) {
            var socket = arguments.length > 1 ? new WS(a, b) : new WS(a);
            var proxySocket;
            // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
            var onmessageDesc = Object.getOwnPropertyDescriptor(socket, 'onmessage');
            if (onmessageDesc && onmessageDesc.configurable === false) {
                proxySocket = Object.create(socket);
                ['addEventListener', 'removeEventListener', 'send', 'close'].forEach(function (propName) {
                    proxySocket[propName] = function () {
                        return socket[propName].apply(socket, arguments);
                    };
                });
            }
            else {
                // we can patch the real socket
                proxySocket = socket;
            }
            utils_1.patchOnProperties(proxySocket, ['close', 'error', 'message', 'open']);
            return proxySocket;
        };
        for (var prop in WS) {
            _global.WebSocket[prop] = WS[prop];
        }
    }
    exports_1("apply", apply);
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=websocket.js.map