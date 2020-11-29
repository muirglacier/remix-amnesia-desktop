const remixd = require('./remixd')
const path = require('path')
const os = require('os')
var static = require('node-static');

const { version } = require('./package.json')
const applicationMenu = require('./applicationMenu')
const { app, BrowserWindow, shell } = require('electron')
const { AppManager, registerPackageProtocol } = require('@philipplgh/electron-app-manager')

const cacheDir = path.join(os.homedir(), '.cache_remix_ide')
registerPackageProtocol(cacheDir)

console.log('running', version)

const sharedFolderClient = new remixd.services.sharedFolder()
var file = new static.Server(`${__dirname}/remix-ide`)

let serveStart = () => {
  require('http').createServer(function (request, response) {
      request.addListener('end', function () {
          file.serve(request, response)
      }).resume()
  }).listen(9990)
}

function createWindow () {
  let win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'build/icon.png')
  })
  applicationMenu(sharedFolderClient)
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  })
  win.loadURL('http://localhost:9990')

}

app.on('ready', () => {
  remixdStart()
  serveStart()
  createWindow()  
})

let remixdStart = () => {
  
  console.log('start shared folder service')
  try {
    let remixIdeUrl = "http://localhost:9990"
    const websocketHandler = new remixd.Websocket(65520, { remixIdeUrl }, sharedFolderClient)
    websocketHandler.start((ws) => {
      console.log('set websocket')
      sharedFolderClient.setWebSocket(ws)
    })
  } catch (error) {
    throw new Error(error)
  }
}
