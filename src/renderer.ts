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

import historyStack from './history';
import './index.css';
import { FilePermissions, FileSystemObjectDetails, NonFileFileTypes } from './ipc/FileSystemObjectDetailsType';


export type ElectronAPIType = {
    getDetailsAboutFilesIn: (path: string) => Promise<FileSystemObjectDetails[]>,
    getCurrentlySelectedFolder: () => Promise<string>,
    setCurrentlySelectedFolder: (path: string) => void,

    addFavoriteFolder: (path: string) => void,
    removeFavoriteFolder: (path: string) => void,
    getFavoriteFolders: () => Promise<string[]>,

    getSeparator: () => Promise<string>,
    isInitialized: () => Promise<boolean>,

    getFileDisplayHeaderColumns: () => Promise<string[]>,
    setFileDisplayHeaderColumns: (columns: string[]) => void,
}

export function electronAPI(): ElectronAPIType {
    return (window as any).electronAPI
}


window.onload = async function () {

    await historyStack.pushFolder(await electronAPI().getCurrentlySelectedFolder())

    const backButton: HTMLButtonElement = document.querySelector("#back-button")
    backButton.addEventListener("click", event => {
        if (historyStack.canGoBack()) {
            const folderPath = historyStack.back()
            electronAPI().setCurrentlySelectedFolder(folderPath)
            updateFileDisplayContents()
        }
    })

    const forwardButton: HTMLButtonElement = document.querySelector("#forward-button")
    forwardButton.addEventListener("click", event => {
        if (historyStack.canGoForward()) {
            const folderPath = historyStack.forward()
            electronAPI().setCurrentlySelectedFolder(folderPath)
            updateFileDisplayContents()
        }
    })

    updateFavoriteFolders()
    updateFileDisplayContents()
}

async function updateFavoriteFolders() {
    const favoriteFoldersContainer: HTMLUListElement = document.querySelector("#favorites-bar")

    const newChildren = await Promise.all((await electronAPI().getFavoriteFolders()).map(async (favoriteFolderPath) => {
        const li = document.createElement("li")
        li.classList.add("favorites-folder-list-item")

        li.addEventListener("click", ev => {
            historyStack.pushFolder(favoriteFolderPath)
            electronAPI().setCurrentlySelectedFolder(favoriteFolderPath)
            updateFileDisplayContents()
        })

        const separator = await electronAPI().getSeparator()
        if (favoriteFolderPath.indexOf(separator) !== -1) {
            const folderObject = document.createElement("object")
            folderObject.data = "/src/static/folder.svg"
            li.appendChild(folderObject)

            const span = document.createElement("span")
            span.textContent = favoriteFolderPath.substring(favoriteFolderPath.lastIndexOf(separator) + 1)
            li.appendChild(span)
        } else {
            li.textContent = favoriteFolderPath
        }

        return li
    }))

    favoriteFoldersContainer.replaceChildren(...newChildren)
}

async function updateFileDisplayContents() {
    const fileDisplayContainer: HTMLUListElement = document.querySelector("#file-display")
    const visibleColumns = await electronAPI().getFileDisplayHeaderColumns()

    const currentlySelectedFolderPath = await electronAPI().getCurrentlySelectedFolder()
    const infoObjects = await electronAPI().getDetailsAboutFilesIn(currentlySelectedFolderPath)

    
    
    const columns = [
        "name",
        "size",
        "type",
        "owner",
        "group",
        "permissions",
        "location",
        "dateModified",
        "dateAccessed",
        "dateCreated",
    ].filter(column => visibleColumns.includes(column))

    const children = infoObjects.map(fileDetails => {
        const row = document.createElement("div")
        row.classList.add("file-display-list-item")

        if (visibleColumns.includes("name")) {
            row.appendChild(renderFileName("p", fileDetails.name))
        }

        if (columns.includes("size")) {
            row.appendChild(renderFileSize("p", fileDetails.size, NonFileFileTypes.includes(fileDetails.type)))
        }

        if (columns.includes("type")) {
            row.appendChild(renderFileType("p", fileDetails.type))
        }

        if (columns.includes("owner")) {
            row.appendChild(renderFileOwner("p", fileDetails.owner))
        }

        if (columns.includes("group")) {
            row.appendChild(renderFileGroup("p", fileDetails.group))
        }

        if (columns.includes("permissions")) {
            row.appendChild(renderFilePermissions("p", fileDetails.permissions))
        }

        if (columns.includes("location")) {
            row.appendChild(renderFileLocation("p", fileDetails.location))
        }

        if (columns.includes("dateModified")) {
            row.appendChild(renderFileDateModified("p", fileDetails.dateModified))
        }

        if (columns.includes("dateAccessed")) {
            row.appendChild(renderFileDateAccessed("p", fileDetails.dateAccessed))
        }

        if (columns.includes("dateCreated")) {
            row.appendChild(renderFileDateCreated("p", fileDetails.dateCreated))
        }

        return row
    })

    fileDisplayContainer.replaceChildren(
        renderFileInfoHeader("p", columns),
        ...children,
    );
}


function renderFileInfoHeader<T extends keyof HTMLElementTagNameMap>(type: T, columns: string[]) {
    const div = document.createElement("div")
    div.classList.add("file-display-list-item", "file-display-list-header")
    
    for (const column of columns) {
        let caption = ""
        let cssClassName = ""
        if (column === "name") {
            caption = "Name"
            cssClassName = "file-display-name"
        }
        if (column === "size") {
            caption = "Size"
            cssClassName = "file-display-size"
        }
        if (column === "type") {
            caption = "Type"
            cssClassName = "file-display-type"
        }
        if (column === "owner") {
            caption = "Owner"
            cssClassName = "file-display-owner"
        }
        if (column === "group") {
            caption = "Group"
            cssClassName = "file-display-group"
        } 
        if (column === "permissions") {
            caption = "Permissions"
            cssClassName = "file-display-permissions"
        }
        if (column === "location") {
            caption = "Location"
            cssClassName = "file-display-location"
        }
        if (column === "dateModified") {
            caption = "Date Modified"
            cssClassName = "file-display-modified"
        }
        if (column === "dateAccessed") {
            caption = "Date Accessed"
            cssClassName = "file-display-accessed"
        }
        if (column === "dateCreated") {
            caption = "Date Created"
            cssClassName = "file-display-created"
        }
        
        const element = document.createElement(type)
        element.classList.add(cssClassName)
        element.innerText = caption
        div.appendChild(element)
    }

    return div
}


function renderFileName<T extends keyof HTMLElementTagNameMap>(type: T, fileName: string) {
    const element = document.createElement(type)
    element.classList.add("file-display-name")
    element.innerText = fileName
    return element
}

function renderFileSize<T extends keyof HTMLElementTagNameMap>(type: T, size: number, useStandardSize: boolean) {
    const element = document.createElement(type)
    element.classList.add("file-display-size")

    if (useStandardSize) {
        if (size < 1000) {
            element.textContent += `${size} ${size === 1 ? "byte" : "bytes"}`
        } else if (size < 10e6) {
            element.textContent += `${Math.trunc(size / 1000)} KB`
        } else if (size < 10e9) {
            element.textContent += `${Math.trunc(size / 10e6)} MB`
        } else if (size < 10e12) {
            element.textContent += `${Math.trunc(size / 10e9)} GB`
        } else {
            element.textContent += `${Math.trunc(size) / 10e12} TB`
        }
    } else {
        element.textContent = "-"
    }

    return element
}

function renderFileType<T extends keyof HTMLElementTagNameMap>(type: T, fileType: string) {
    const element = document.createElement(type)
    element.classList.add("file-display-type")
    element.innerText = fileType
    return element
}

function renderFileOwner<T extends keyof HTMLElementTagNameMap>(type: T, fileOwner: string) {
    const element = document.createElement(type)
    element.classList.add("file-display-owner")
    element.innerText = fileOwner
    return element
}

function renderFileGroup<T extends keyof HTMLElementTagNameMap>(type: T, fileGroup: string) {
    const element = document.createElement(type)
    element.classList.add("file-display-group")
    element.innerText = fileGroup
    return element
}

function renderFilePermissions<T extends keyof HTMLElementTagNameMap>(type: T, filePermissions: FilePermissions) {
    const element = document.createElement(type)
    element.classList.add("file-display-permissions")
    if (filePermissions.read) {
        element.textContent += "R"
    }
    if (filePermissions.write) {
        element.textContent += "W"
    }
    if (filePermissions.execute) {
        element.textContent += "X"
    }
    return element
}

function renderFileLocation<T extends keyof HTMLElementTagNameMap>(type: T, fileLocation: string) {
    const element = document.createElement(type)
    element.classList.add("file-display-location")
    element.innerText = fileLocation
    return element
}

function renderFileDateModified<T extends keyof HTMLElementTagNameMap>(type: T, fileDateModified: number) {
    const element = document.createElement(type)
    element.classList.add("file-display-modified")
    
    const date = new Date()
    date.setTime(fileDateModified)
    element.innerText = date.toDateString()

    return element
}

function renderFileDateAccessed<T extends keyof HTMLElementTagNameMap>(type: T, fileDateAccessed: number) {
    const element = document.createElement(type)
    element.classList.add("file-display-accessed")
    
    const date = new Date()
    date.setTime(fileDateAccessed)
    element.innerText = date.toDateString()

    return element
}

function renderFileDateCreated<T extends keyof HTMLElementTagNameMap>(type: T, fileDateCreated: number) {
    const element = document.createElement(type)
    element.classList.add("file-display-created")
    
    const date = new Date()
    date.setTime(fileDateCreated)
    element.innerText = date.toDateString()

    return element
}