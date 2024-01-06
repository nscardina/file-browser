import Store from "electron-store"
import path from "node:path"
import os from "node:os"

let storeInitialized = false

type StoreDataType = {
    favorites: string[],
    initialLoadFolder: string,
}

let _store: Store<StoreDataType> | null = null
let _currentlySelectedFolder: string | null = null

function initializeStore() {
    _store = new Store<StoreDataType>()

    if (_store.get("favorites") === undefined) {
      _store.set("favorites", [
        path.join(os.homedir(), "Desktop"),
        path.join(os.homedir(), "Documents"),
        path.join(os.homedir(), "Downloads"),
        path.join(os.homedir(), "Pictures"),
        path.join(os.homedir(), "Videos")
      ])
    }
    
    if (_store.get("initialLoadFolder") === undefined) {
      _store.set("initialLoadFolder", os.homedir())
    }
    
    _currentlySelectedFolder = _store.get("initialLoadFolder")
    storeInitialized = true
    return _store
}

export default function store(): Store<StoreDataType> {
    if (storeInitialized) {
        return _store
    } else {
        return initializeStore()
    }
}

export function getCurrentlySelectedFolderPath(): string {
  return _currentlySelectedFolder;
}

export function setCurrentlySelectedFolderPath(path: string): void {
  _currentlySelectedFolder = path
}