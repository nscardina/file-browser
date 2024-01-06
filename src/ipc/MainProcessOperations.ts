import { IpcMain, IpcMainInvokeEvent } from "electron";
import fs from "node:fs";
import path from "path";
import { getFileTypeName, getFileOwner, getGroupOwner, getFilePermissions } from './FileSystemObjectDetails';
import { FileSystemObjectDetails } from "./FileSystemObjectDetailsType";
import store from "../store.js";


export function getDetailsAboutFilesIn(_: IpcMainInvokeEvent, fPath: string): FileSystemObjectDetails[] {
  const fileSystemObjects: any[] = [];

  fs.readdirSync(fPath).forEach(filePath => {
    const stat = fs.statSync(path.resolve(fPath, filePath));

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
    };

    fileSystemObjects.push(fileSystemObjectDetails);
  });

  return fileSystemObjects;
}

export function addFavoriteFolder(_: IpcMainInvokeEvent, fPath: string): void {
  const favorites = store().get("favorites")
  if (!favorites.includes(fPath)) {
    favorites.push(fPath)
  }
}

export function removeFavoriteFolder(_: IpcMainInvokeEvent, fPath: string): void {
  const favorites = store().get("favorites")
  if (favorites.indexOf(fPath) !== -1) {
    favorites.splice(favorites.indexOf(fPath), 1)
  }
}

export function getFavoriteFolders(): string[] {
  return store().get("favorites")
}

export function getSeparator(): string {
  return path.sep
}