let commentsData = []

let nextId = 1

export function getComments() {
    return commentsData
}

export function setComments(newComments) {
Hw4
    commentsData = newComments
    commentsData = newComments.map((c) => ({
        ...c,
        isLikeLoading: false,
    }))
main

    if (newComments.length > 0) {
        const maxId = Math.max(...newComments.map((c) => c.id || 0))
        nextId = maxId + 1
    }
}

export function getNextId() {
    return nextId++
}
