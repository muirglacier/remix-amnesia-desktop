"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const isbinaryfile = require("isbinaryfile");
const pathModule = require("path");
/**
 * returns the absolute path of the given @arg path
 *
 * @param {String} path - relative path (Unix style which is the one used by Remix IDE)
 * @param {String} sharedFolder - absolute shared path. platform dependent representation.
 * @return {String} platform dependent absolute path (/home/user1/.../... for unix, c:\user\...\... for windows)
 */
function absolutePath(path, sharedFolder) {
    path = normalizePath(path);
    if (path.indexOf(sharedFolder) !== 0) {
        path = pathModule.resolve(sharedFolder, path);
    }
    return path;
}
exports.absolutePath = absolutePath;
/**
 * return the relative path of the given @arg path
 *
 * @param {String} path - absolute platform dependent path
 * @param {String} sharedFolder - absolute shared path. platform dependent representation
 * @return {String} relative path (Unix style which is the one used by Remix IDE)
 */
function relativePath(path, sharedFolder) {
    const relative = pathModule.relative(sharedFolder, path);
    return normalizePath(relative);
}
exports.relativePath = relativePath;
function normalizePath(path) {
    if (process.platform === 'win32') {
        return path.replace(/\\/g, '/');
    }
    return path;
}
function walkSync(dir, filelist, sharedFolder) {
    const files = fs.readdirSync(dir);
    filelist = filelist || {};
    files.forEach(function (file) {
        const subElement = pathModule.join(dir, file);
        if (!fs.lstatSync(subElement).isSymbolicLink()) {
            if (fs.statSync(subElement).isDirectory()) {
                filelist = walkSync(subElement, filelist, sharedFolder);
            }
            else {
                const relative = relativePath(subElement, sharedFolder);
                filelist[relative] = isbinaryfile.sync(subElement);
            }
        }
    });
    return filelist;
}
exports.walkSync = walkSync;
function resolveDirectory(dir, sharedFolder) {
    const ret = {};
    const files = fs.readdirSync(dir);
    files.forEach(function (file) {
        const subElement = pathModule.join(dir, file);
        if (!fs.lstatSync(subElement).isSymbolicLink()) {
            const relative = relativePath(subElement, sharedFolder);
            ret[relative] = { isDirectory: fs.statSync(subElement).isDirectory() };
        }
    });
    return ret;
}
exports.resolveDirectory = resolveDirectory;
/**
 * returns the absolute path of the given @arg url
 *
 * @param {String} url - Remix-IDE URL instance
 * @return {String} extracted domain name from url
 */
function getDomain(url) {
    // eslint-disable-next-line
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);
    return domainMatch ? domainMatch[0] : null;
}
exports.getDomain = getDomain;
//# sourceMappingURL=utils.js.map