import { commentsData, getNextId } from './data.js'
import { renderComments, escapeHtml, getCurrentDate } from './render.js'

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
    const comment = commentsData[index]

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
    if (event.target.closest('.like-button')) {
        return
    }

    const commentElement = event.currentTarget
    const index = parseInt(commentElement.dataset.index)
    const comment = commentsData[index]

    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')

    const safeName = escapeHtml(comment.name)
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

function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')

    const name = escapeHtml(nameInput.value.trim())
    const text = escapeHtml(textInput.value.trim())

    if (!name || !text) {
        alert('Пожалуйста, заполните имя и комментарий')
        return
    }

    commentsData.push({
        id: getNextId(),
        name: name,
        date: getCurrentDate(),
        text: text,
        likes: 0,
        isLiked: false,
    })

    nameInput.value = ''
    textInput.value = ''

    renderComments()
    initLikeListeners()
    initQuoteListeners()
}
