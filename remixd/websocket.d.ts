/// <reference types="node" />
import * as WS from 'ws';
import * as http from 'http';
import { WebsocketOpt, SharedFolderClient } from './types';
export default class WebSocket {
    port: number;
    opt: WebsocketOpt;
    sharedFolder: SharedFolderClient;
    server: http.Server;
    wsServer: WS.Server;
    constructor(port: number, opt: WebsocketOpt, sharedFolder: SharedFolderClient);
    start(callback?: (ws: WS) => void): void;
    close(): void;
}
