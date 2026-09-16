import { commentsData } from './data.js'

export function escapeHtml(text) {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

import { format } from 'date-fns'

export function getCurrentDate() {
    return format(new Date(), 'dd.MM.yy HH:mm')
}

export function renderComments() {
    const commentsList = document.querySelector('.comments')

    commentsList.innerHTML = ''

    commentsData.forEach((comment, index) => {
        const li = document.createElement('li')
        li.className = 'comment'
        li.dataset.index = index

        const header = document.createElement('div')
        header.className = 'comment-header'

        const nameDiv = document.createElement('div')
        nameDiv.textContent = comment.name

        const dateDiv = document.createElement('div')
        dateDiv.textContent = comment.date

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
        counter.textContent = comment.likes

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
