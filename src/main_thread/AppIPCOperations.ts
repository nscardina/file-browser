import { IpcMainInvokeEvent } from "electron";
import store, { getCurrentlySelectedFolderPath, setCurrentlySelectedFolderPath } from "../store";


function getCurrentlySelectedFolder(_: IpcMainInvokeEvent): string {
  return getCurrentlySelectedFolderPath();
}

function setCurrentlySelectedFolder(_: IpcMainInvokeEvent, path: string): void {
  setCurrentlySelectedFolderPath(path);
}

function addFavoriteFolder(_: IpcMainInvokeEvent, fPath: string): void {
  const favorites = store().get("favorites");
  if (!favorites.includes(fPath)) {
    favorites.push(fPath);
  }
}

function removeFavoriteFolder(_: IpcMainInvokeEvent, fPath: string): void {
  const favorites = store().get("favorites");
  if (favorites.indexOf(fPath) !== -1) {
    favorites.splice(favorites.indexOf(fPath), 1);
  }
}

function getFavoriteFolders(): string[] {
  return store().get("favorites");
}

export const AppIPC = {
  getCurrentlySelectedFolder,
  setCurrentlySelectedFolder,
  addFavoriteFolder,
  removeFavoriteFolder,
  getFavoriteFolders,
}