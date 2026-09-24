import { getComments } from './data.js'

export function escapeHtml(text) {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

export function formatDate(dateString) {
    if (!dateString) return ''

    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
}

export function renderComments() {
    const commentsList = document.querySelector('.comments')
    commentsList.innerHTML = ''

    const comments = getComments()

    comments.forEach((comment, index) => {
        const li = document.createElement('li')
        li.className = 'comment'
        li.dataset.index = index

        const header = document.createElement('div')
        header.className = 'comment-header'

        const nameDiv = document.createElement('div')
        nameDiv.textContent = comment.author.name

        const dateDiv = document.createElement('div')
        dateDiv.textContent = formatDate(comment.createdAt || comment.date)

        header.appendChild(nameDiv)
        header.appendChild(dateDiv)

        const body = document.createElement('div')
        body.className = 'comment-body'

        const textDiv = document.createElement('div')
        textDiv.className = 'comment-text'
        textDiv.textContent = comment.text

        body.appendChild(textDiv)

        const footer = document.createElement('div')
        footer.className = 'comment-footer'

        const likes = document.createElement('div')
        likes.className = 'likes'

        const counter = document.createElement('span')
        counter.className = 'likes-counter'
        counter.textContent = comment.likes || 0

        const likeBtn = document.createElement('button')
        likeBtn.className = comment.isLiked
            ? 'like-button -active-like'
            : 'like-button'
        likeBtn.dataset.index = index

        likes.appendChild(counter)
        likes.appendChild(likeBtn)
        footer.appendChild(likes)

        li.appendChild(header)
        li.appendChild(body)
        li.appendChild(footer)

        commentsList.appendChild(li)
    })
}
