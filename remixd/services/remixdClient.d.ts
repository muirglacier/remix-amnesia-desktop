import { PluginClient } from '@remixproject/plugin';
import { SharedFolderArgs, TrackDownStreamUpdate, Filelist, ResolveDirectory, FileContent } from '../types';
import * as WS from 'ws';
export declare class RemixdClient extends PluginClient {
    methods: ['folderIsReadOnly', 'resolveDirectory', 'get', 'exists', 'isFile', 'set', 'list', 'isDirectory'];
    trackDownStreamUpdate: TrackDownStreamUpdate;
    websocket: WS;
    currentSharedFolder: string;
    readOnly: boolean;
    setWebSocket(websocket: WS): void;
    sharedFolder(currentSharedFolder: string, readOnly: boolean): void;
    list(): Filelist;
    resolveDirectory(args: SharedFolderArgs): ResolveDirectory;
    folderIsReadOnly(): boolean;
    get(args: SharedFolderArgs): Promise<FileContent>;
    exists(args: SharedFolderArgs): boolean;
    set(args: SharedFolderArgs): Promise<void>;
    rename(args: SharedFolderArgs): Promise<boolean>;
    remove(args: SharedFolderArgs): Promise<boolean>;
    isDirectory(args: SharedFolderArgs): boolean;
    isFile(args: SharedFolderArgs): boolean;
    setupNotifications(path: string): void;
}
