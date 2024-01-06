
export type FileSystemObjectDetails = {
    name: string
    size: number
    type: string
    owner: string
    group: string
    permissions: FilePermissions
    location: string
    dateModified: number // Get this from date.getTime(), use date.setTime() to get the date object back
    dateAccessed: number // see above
    dateCreated: number // see above
}

export type FilePermissions = {
    read: boolean
    write: boolean
    execute: boolean
}

