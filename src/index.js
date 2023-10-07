const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
isDev = false

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:700,
    minHeight:600,
    webPreferences: {
      nodeIntegration:true,
      devTools:isDev,
      
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.maximize()

  const noMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(noMenu)

  // Listen for IPC message to show a success box
  ipcMain.on('show-success-box', (event, args) => {
    const options = {
      type: 'info',
      title: args.title,
      message: args.message,
      buttons: ['OK'],
    };
    dialog.showMessageBox(mainWindow, options);
  });
};


// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//No menu
const menu = []