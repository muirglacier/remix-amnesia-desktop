import * as ServiceList from '../serviceList';
import * as Websocket from 'ws';
declare type ServiceListKeys = keyof typeof ServiceList;
export declare type SharedFolder = typeof ServiceList[ServiceListKeys];
export declare type SharedFolderClient = InstanceType<typeof ServiceList[ServiceListKeys]>;
export declare type WebsocketOpt = {
    remixIdeUrl: string;
};
export declare type FolderArgs = {
    path: string;
};
export declare type KeyPairString = {
    [key: string]: string;
};
export declare type ResolveDirectory = {
    [key: string]: {
        isDirectory: boolean;
    };
};
export declare type FileContent = {
    content: string;
    readonly: boolean;
};
export declare type TrackDownStreamUpdate = KeyPairString;
export declare type SharedFolderArgs = FolderArgs & KeyPairString;
export declare type WS = typeof Websocket;
export declare type Filelist = KeyPairString;
export {};
