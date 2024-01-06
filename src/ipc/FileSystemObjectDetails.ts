import os from "node:os"
import fs from "node:fs"
import { execSync } from "node:child_process"
import { accessSync, constants } from "node:fs"
import { FilePermissions } from "./FileSystemObjectDetailsType"

export function getFileTypeName(extension: string): string {
    return `${extension.trim() === "" ? "" : `${extension.toUpperCase()} `}File`
}

export function getFileOwner(path: string): string {
    if (os.platform() === "darwin" || os.platform() === "linux") {
        const stat = fs.statSync(path)
        const commandOutput = execSync(`getent passwd ${stat.uid}`).toString()
        return commandOutput.substring(0, commandOutput.indexOf(":"))
    }
    else if (os.platform() === "win32") {
        const commandOutput = execSync(`(Get-Acl "${path}").Owner`, {"shell": "powershell.exe"}).toString()
        return commandOutput
    } 
    else {
        return "Unknown"
    }
}

export function getGroupOwner(path: string): string {
    if (os.platform() === "darwin" || os.platform() === "linux") {
        const commandOutput = execSync(`stat -c "%G" "${path}"`).toString()
        return commandOutput
    }
    else if (os.platform() === "win32") {
        const commandOutput = execSync(`(Get-Acl "${path}").Group`, {"shell": "powershell.exe"}).toString()
        return commandOutput
    }
    else {
        return "Unknown"
    }
}

export function getFilePermissions(path: string): FilePermissions {
    let canRead = false
    let canWrite = false
    let canExecute = false

    try {
        accessSync(path, constants.R_OK)
        canRead = true
    } catch {}

    try {
        accessSync(path, constants.W_OK)
        canWrite = true
    } catch {}

    try {
        accessSync(path, constants.X_OK)
        canExecute = true
    } catch {}

    return {
        read: canRead,
        write: canWrite,
        execute: canExecute
    }
}