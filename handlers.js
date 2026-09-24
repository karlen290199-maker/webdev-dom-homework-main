import { getComments } from './data.js'
import { renderComments, escapeHtml } from './render.js'
import { postComment } from './api.js'

export function initLikeListeners() {
    const likeButtons = document.querySelectorAll('.like-button')
    likeButtons.forEach((button) => {
        button.addEventListener('click', handleLikeClick)
    })
}

export function initQuoteListeners() {
    const comments = document.querySelectorAll('.comment')
    comments.forEach((comment) => {
        comment.addEventListener('click', handleQuoteClick)
    })
}

function handleLikeClick(event) {
    const button = event.target

    if (!button.classList.contains('like-button')) return

    event.stopPropagation()

    const index = parseInt(button.dataset.index)

    const comments = getComments()
    const comment = comments[index]

    if (comment.isLiked) {
        comment.isLiked = false
        comment.likes -= 1
    } else {
        comment.isLiked = true
        comment.likes += 1
    }

    renderComments()
    initLikeListeners()
    initQuoteListeners()
}

function handleQuoteClick(event) {
    if (event.target.closest('.like-button')) return

    const commentElement = event.currentTarget
    const index = parseInt(commentElement.dataset.index)

    const comments = getComments()
    const comment = comments[index]

    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')

    const authorName = comment.author?.name || comment.name || 'Без имени'
    const safeName = escapeHtml(authorName)
    const safeText = escapeHtml(comment.text)

    nameInput.value = safeName

    const quotedText = safeText
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')
    textInput.value = `${quotedText}\n\n`

    textInput.focus()
    textInput.setSelectionRange(textInput.value.length, textInput.value.length)
}

export function initAddCommentListener() {
    const addButton = document.querySelector('.add-form-button')
    addButton.addEventListener('click', handleAddComment)

    const textInput = document.querySelector('.add-form-text')
    textInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleAddComment()
        }
    })
}

async function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')

    const name = nameInput.value.trim()
    const text = textInput.value.trim()

    if (!name || !text) {
        alert('Пожалуйста, заполните имя и комментарий')
        return
    }

    try {
        const newComment = await postComment({ name, text })

        console.log('Что вернул POST:', newComment)

        const comments = getComments()
        comments.push(newComment)

        nameInput.value = ''
        textInput.value = ''

        renderComments()
        initLikeListeners()
        initQuoteListeners()
    } catch (error) {
        console.error('Ошибка при добавлении:', error)
        alert('Не удалось добавить комментарий')
    }
}
