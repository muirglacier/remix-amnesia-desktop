'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const remixdClient_1 = require("./services/remixdClient");
const websocket_1 = require("./websocket");
const utils = require("./utils");
module.exports = {
    Websocket: websocket_1.default,
    utils,
    services: {
        sharedFolder: remixdClient_1.RemixdClient
    }
};
//# sourceMappingURL=index.js.map