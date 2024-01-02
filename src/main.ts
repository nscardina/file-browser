import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import fs from "node:fs"
import { getGroupOwner, getFileOwner, getFileTypeName, getFilePermissions, FileSystemObjectDetails } from './ipc/FileSystemObjectDetails';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function getDetailsAboutFilesIn(event: IpcMainInvokeEvent, fPath: string): FileSystemObjectDetails[] {
  const fileSystemObjects: any[] = []

  fs.readdirSync(fPath).forEach(filePath => {
    const stat = fs.statSync(path.resolve(fPath, filePath))
    
    const fileSystemObjectDetails = {
      name: path.basename(filePath),
      size: stat.size,
      type: stat.isBlockDevice() ? "Block Device" :
            stat.isCharacterDevice() ? "Character Device" :
            stat.isDirectory() ? "Directory" :
            stat.isFIFO() ? "FIFO special file" :
            stat.isFile() ? getFileTypeName(path.extname(filePath).substring(1)) : 
            stat.isSocket() ? "Socket" : 
            stat.isSymbolicLink() ? "Symbolic Link" : 
            "Unknown",
      owner: getFileOwner(path.resolve(fPath, filePath)),
      group: getGroupOwner(path.resolve(fPath, filePath)),
      permissions: getFilePermissions(path.resolve(fPath, filePath)),
      location: path.resolve(fPath, filePath),
      modified: stat.mtimeMs,
      accessed: stat.atimeMs,
      created: stat.ctimeMs,
    }

    fileSystemObjects.push(fileSystemObjectDetails)
  })

  return fileSystemObjects
}

const createWindow = () => {

  ipcMain.handle("fs:getDetailsAboutFilesIn", getDetailsAboutFilesIn)

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
