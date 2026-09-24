let commentsData = []

let nextId = 1

export function getComments() {
    return commentsData
}

export function setComments(newComments) {
    commentsData = newComments

    if (newComments.length > 0) {
        const maxId = Math.max(...newComments.map((c) => c.id || 0))
        nextId = maxId + 1
    }
}

export function getNextId() {
    return nextId++
}
