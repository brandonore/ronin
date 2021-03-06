const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
require('electron-reload')(__dirname);
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  ipcMain.on('click', function(event, arg) {
    if(arg) {
        const pwin = new BrowserWindow({
            width: 1240,
            height: 1123,
            frame: false,
            webPreferences: {plugins: true}
          })
          pwin.loadURL(`file://${__dirname}/preview.html`);
          pwin.webContents.on('did-finish-load', () => {
            pwin.webContents.send('update-iframe', arg);
        });
          event.sender.send('reply', 'test');
    } else {
        event.sender.send('reply', 'no arg supplied');
    }
  });

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 1354, height: 1123, frame: false, webPreferences: {nativeWindowOpen: true}})
  
    // and load the index.html of the app.
    // win.loadFile('index.html')
    win.loadURL(`file://${__dirname}/index.html`);
  
    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  