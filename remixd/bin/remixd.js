#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const websocket_1 = require("../websocket");
const servicesList = require("../serviceList");
const utils_1 = require("../utils");
const axios_1 = require("axios");
const fs = require("fs-extra");
const path = require("path");
const program = require("commander");
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    program
        .usage('-s <shared folder>')
        .description('Provide a two-way connection between the local computer and Remix IDE')
        .option('--remix-ide  <url>', 'URL of remix instance allowed to connect to this web sockect connection')
        .option('-s, --shared-folder <path>', 'Folder to share with Remix IDE')
        .option('--read-only', 'Treat shared folder as read-only (experimental)')
        .on('--help', function () {
        console.log('\nExample:\n\n    remixd -s ./ --remix-ide http://localhost:8080');
    }).parse(process.argv);
    // eslint-disable-next-line
    const killCallBack = [];
    if (!program.remixIde) {
        console.log('\x1b[33m%s\x1b[0m', '[WARN] You can only connect to remixd from one of the supported origins.');
    }
    else {
        const isValid = yield isValidOrigin(program.remixIde);
        /* Allow unsupported origins and display warning. */
        if (!isValid) {
            console.log('\x1b[33m%s\x1b[0m', '[WARN] You are using IDE from an unsupported origin.');
            console.log('\x1b[33m%s\x1b[0m', 'Check https://gist.github.com/EthereumRemix/091ccc57986452bbb33f57abfb13d173 for list of all supported origins.\n');
            // return
        }
        console.log('\x1b[33m%s\x1b[0m', '[WARN] You may now only use IDE at ' + program.remixIde + ' to connect to that instance');
    }
    if (program.sharedFolder) {
        console.log('\x1b[33m%s\x1b[0m', '[WARN] Any application that runs on your computer can potentially read from and write to all files in the directory.');
        console.log('\x1b[33m%s\x1b[0m', '[WARN] Symbolic links are not forwarded to Remix IDE\n');
        try {
            const sharedFolderClient = new servicesList.Sharedfolder();
            const websocketHandler = new websocket_1.default(65520, { remixIdeUrl: program.remixIde }, sharedFolderClient);
            websocketHandler.start((ws) => {
                sharedFolderClient.setWebSocket(ws);
                sharedFolderClient.setupNotifications(program.sharedFolder);
                sharedFolderClient.sharedFolder(program.sharedFolder, program.readOnly || false);
            });
            killCallBack.push(websocketHandler.close.bind(websocketHandler));
        }
        catch (error) {
            throw new Error(error);
        }
    }
    else {
        console.log('\x1b[31m%s\x1b[0m', '[ERR] No valid shared folder provided.');
    }
    // kill
    function kill() {
        for (const k in killCallBack) {
            try {
                killCallBack[k]();
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    process.on('SIGINT', kill); // catch ctrl-c
    process.on('SIGTERM', kill); // catch kill
    process.on('exit', kill);
    function isValidOrigin(origin) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!origin)
                return false;
            const domain = utils_1.getDomain(origin);
            const gistUrl = 'https://gist.githubusercontent.com/EthereumRemix/091ccc57986452bbb33f57abfb13d173/raw/3367e019335746b73288e3710af2922d4c8ef5a3/origins.json';
            try {
                const { data } = yield axios_1.default.get(gistUrl);
                try {
                    yield fs.writeJSON(path.resolve(path.join(__dirname, '..', 'origins.json')), { data });
                }
                catch (e) {
                    console.error(e);
                }
                return data.includes(origin) ? data.includes(origin) : data.includes(domain);
            }
            catch (e) {
                try {
                    // eslint-disable-next-line
                    const origins = require('../origins.json');
                    const { data } = origins;
                    return data.includes(origin) ? data.includes(origin) : data.includes(domain);
                }
                catch (e) {
                    return false;
                }
            }
        });
    }
}))();
//# sourceMappingURL=remixd.js.map