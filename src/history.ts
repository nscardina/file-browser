let folders_visited_stack: string[] = []
let current_folder_index: number = -1

function pushFolder(path: string): void {
    if (current_folder_index === folders_visited_stack.length - 1) {
        folders_visited_stack.push(path)
    } else {
        // folders_visited_stack.splice(current_folder_index, Infinity)
        // folders_visited_stack.
        folders_visited_stack.length = current_folder_index + 1
        folders_visited_stack.push(path)
    }
    current_folder_index++
    console.log(folders_visited_stack)
    console.log(path)
}

function canGoBack(): boolean {
    console.log(current_folder_index)
    return current_folder_index >= 1
}

function back(): string {
    if (canGoBack()) {
        current_folder_index--
        return folders_visited_stack[current_folder_index]
    } else {
        throw "Cannot go back any more"
    }
}

function canGoForward(): boolean {
    return current_folder_index < folders_visited_stack.length - 1
}

function forward(): string {
    if (canGoForward()) {
        current_folder_index++
        return folders_visited_stack[current_folder_index]
    } else {
        throw "Cannot go forward any more"
    }
}

export default {
    pushFolder,
    canGoBack,
    back,
    canGoForward,
    forward,
}