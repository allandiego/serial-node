const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const notifier = require('node-notifier');
const path = require('path');
const request = require('request');
const SerialNode = require('./app/js/serial.js');
// app.getPath('appData')

const image =
  process.platform === 'darwin'
    ? path.join(__dirname, 'app/images', 'logo.icns')
    : path.join(__dirname, 'app/images', 'logo.ico');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: image,
    // transparent:true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('app/index.html');
  // mainWindow.removeMenu()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', async () => {
    // sendNotification('teste', 'teste notification')
    const serial = new SerialNode();
    const portList = await serial.listPorts();
    mainWindow.webContents.send('listPorts', portList);
  });
}
/*
function sendNotification(title, message) {
  notifier.notify({
      appName: "Serial USB",
      title: title,
      message: message,
      icon: path.join(__dirname, 'app/images', 'logo.ico'),
      sound: true,
      wait: true
    })

    notifier.on('click', function (notifierObject, options) {
      shell.openExternal('https://github.com/ngudbhav/TriCo-electron-app/releases/latest')
    })

}

function messageBox(type, title, message) {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Close'],
    title: 'No update available!',
    detail: 'You already have the latest version installed.'
  })
  //dialog.showErrorBox('Some Error occured!', error)
}

function interactiveMessageBox(){
  dialog.showMessageBox({
    type: 'info', //error
    buttons: ['Open Browser to download link', 'Close'],
    title: 'Update Available',
    detail: changeLog,
  }, function (response) {
    if (response === 0) {
      shell.openExternal('https://github.com/ngudbhav/TriCo-electron-app/releases/latest')
    }
  }
)
}
*/

/*
function checkUpdates(e) {
  request('https://api.github.com/repos/ngudbhav/TriCo-electron-app/releases/latest', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1 Win64 x64 rv:59.0) Gecko/20100101 ' } }, (error, html, body) => {
    //console.log(error)
    //console.log(html)
    //console.log(body)
  })
}

ipcMain.on('refreshPortList', () => {
    const portList = serial.listPorts()
    console.log(portList)
    mainWindow.webContents.send('listPorts', portList)
})
*/

app.on('ready', () => {
  createWindow();
  if (process.platform === 'win32') app.setAppUserModelId('serial.node.v1');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
