// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { FileSystemObjectDetails } from "./ipc/FileSystemObjectDetailsType";

contextBridge.exposeInMainWorld("electronAPI", {
    getDetailsAboutFilesIn: (path: string) => ipcRenderer.invoke("fs:getDetailsAboutFilesIn", path),
    getCurrentlySelectedFolder: () => ipcRenderer.invoke("app:getCurrentlySelectedFolder"),
    setCurrentlySelectedFolder: (path: string) => ipcRenderer.invoke("app:setCurrentlySelectedFolder", path),

    addFavoriteFolder: (path: string) => ipcRenderer.invoke("app:addFavoriteFolder", path),
    removeFavoriteFolder: (path: string) => ipcRenderer.invoke("app:removeFavoriteFolder", path),
    getFavoriteFolders: () => ipcRenderer.invoke("app:getFavoriteFolders"),
    
    getSeparator: () => ipcRenderer.invoke("fs:getSeparator"),

    isInitialized: () => ipcRenderer.invoke("app:isInitialized"),
})

