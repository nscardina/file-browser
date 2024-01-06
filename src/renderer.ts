/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { FileSystemObjectDetails } from './ipc/FileSystemObjectDetailsType';
import { getSeparator } from './ipc/MainProcessOperations';


export type ElectronAPIType = {
    getDetailsAboutFilesIn: (path: string) => Promise<FileSystemObjectDetails[]>,
    getCurrentlySelectedFolder: () => Promise<string>,
    setCurrentlySelectedFolder: (path: string) => void,

    addFavoriteFolder: (path: string) => void,
    removeFavoriteFolder: (path: string) => void,
    getFavoriteFolders: () => Promise<string[]>,

    getSeparator: () => Promise<string>,
}

export function electronAPI(): ElectronAPIType {
    return (window as any).electronAPI
}


window.onload = async function() {

    updateFavoriteFolders()
    updateFileDisplayContents()
}

async function updateFavoriteFolders() {
    const favoriteFoldersContainer: HTMLUListElement = document.querySelector("#favorites-bar")

    const newChildren = await Promise.all((await electronAPI().getFavoriteFolders()).map(async(favoriteFolderPath) => {
        const li = document.createElement("li")
        li.classList.add("favorites-folder-list-item")

        li.addEventListener("click", ev => {
            electronAPI().setCurrentlySelectedFolder(favoriteFolderPath)
            updateFileDisplayContents()
        })

        const separator = await electronAPI().getSeparator()
        if (favoriteFolderPath.indexOf(separator) !== -1) {
            li.innerHTML = `<object data="/src/static/folder.svg"></object>`
            li.innerHTML += favoriteFolderPath.substring(favoriteFolderPath.lastIndexOf(separator) + 1)
        } else {
            li.textContent = favoriteFolderPath
        }

        return li
    }))

    favoriteFoldersContainer.replaceChildren(...newChildren)
}

async function updateFileDisplayContents() {
    const fileDisplayContainer: HTMLUListElement = document.querySelector("#file-display")

    const currentlySelectedFolderPath = await electronAPI().getCurrentlySelectedFolder()
    const info = await electronAPI().getDetailsAboutFilesIn(currentlySelectedFolderPath)

    const children = info.map(details => {
        const li = document.createElement("li")
        li.classList.add("file-display-list-item")
        

        if (details.type === "Directory") {
            // li.innerHTML = `<span class="material-icons">folder</span>`
            li.innerHTML = `<object data="/src/static/folder.svg"></object>`
        } else {
            // li.innerHTML = `<span class="material-icons">description</span>`
            li.innerHTML = `<object data="/src/static/generic_file.svg"></object>`
        }

        li.innerHTML += details.name

        return li
    })

    fileDisplayContainer.replaceChildren(...children)
}