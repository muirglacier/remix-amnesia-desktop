"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WS = require("ws");
const http = require("http");
const utils_1 = require("./utils");
const plugin_ws_1 = require("@remixproject/plugin-ws");
class WebSocket {
    constructor(port, opt, sharedFolder) {
        this.port = port;
        this.opt = opt;
        this.sharedFolder = sharedFolder;
    } //eslint-disable-line
    start(callback) {
        this.server = http.createServer((request, response) => {
            console.log((new Date()) + ' Received request for ' + request.url);
            response.writeHead(404);
            response.end();
        });
        const loopback = '127.0.0.1';
        this.server.listen(this.port, loopback, function () {
            console.log((new Date()) + ' remixd is listening on ' + loopback + ':65520');
        });
        this.wsServer = new WS.Server({
            server: this.server,
            verifyClient: (info, done) => {
                if (!originIsAllowed(info.origin, this)) {
                    done(false);
                    console.log((new Date()) + ' Connection from origin ' + info.origin + ' rejected.');
                    return;
                }
                done(true);
            }
        });
        this.wsServer.on('connection', (ws) => {
            const { sharedFolder } = this;
            plugin_ws_1.createClient(ws, sharedFolder);
            if (callback)
                callback(ws);
        });
    }
    close() {
        if (this.wsServer) {
            this.wsServer.close(() => {
                this.server.close();
            });
        }
    }
}
exports.default = WebSocket;
function originIsAllowed(origin, self) {
    if (self.opt.remixIdeUrl) {
        if (self.opt.remixIdeUrl.endsWith('/'))
            self.opt.remixIdeUrl = self.opt.remixIdeUrl.slice(0, -1);
        return origin === self.opt.remixIdeUrl || origin === utils_1.getDomain(self.opt.remixIdeUrl);
    }
    else {
        try {
            // eslint-disable-next-line
            const origins = require('./origins.json');
            const domain = utils_1.getDomain(origin);
            const { data } = origins;
            if (data.includes(origin) || data.includes(domain)) {
                self.opt.remixIdeUrl = origin;
                console.log('\x1b[33m%s\x1b[0m', '[WARN] You may now only use IDE at ' + self.opt.remixIdeUrl + ' to connect to that instance');
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
}
//# sourceMappingURL=websocket.js.map