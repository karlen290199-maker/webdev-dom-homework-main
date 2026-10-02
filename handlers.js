import { getComments, setComments } from './data.js'
import { renderComments, escapeHtml } from './render.js'
import { postComment, fetchComments } from './api.js'

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

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

function handleLikeClick(event) {
    const button = event.target

    if (!button.classList.contains('like-button')) return

    event.stopPropagation()

    const index = parseInt(button.dataset.index)

    const comments = getComments()
    const comment = comments[index]

    comment.isLikeLoading = true

    renderComments()
    initLikeListeners()
    initQuoteListeners()

    delay(2000).then(() => {
        comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1

        comment.isLiked = !comment.isLiked
        comment.isLikeLoading = false

        renderComments()
        initLikeListeners()
        initQuoteListeners()
    })
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

function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')
    const addForm = document.querySelector('.add-form')
    const addFormLoading = document.querySelector('.add-form-loading')

    const name = nameInput.value.trim()
    const text = textInput.value.trim()

    if (!name || !text) {
        alert('Пожалуйста, заполните имя и комментарий')
        return
    }

    if (name.length < 3) {
        alert('Имя должно содержать хотя бы 3 символа')
        return
    }

    if (text.length < 3) {
        alert('Комментарий должен содержать хотя бы 3 символа')
        return
    }

    addForm.style.display = 'none'
    addFormLoading.style.display = 'block'

    postComment({ name, text })
        .then(() => {
            nameInput.value = ''
            textInput.value = ''
            return fetchComments()
        })
        .then((comments) => {
            setComments(comments)

            renderComments()
            initLikeListeners()
            initQuoteListeners()
        })
        .catch((error) => {
            console.error('Ошибка при добавлении:', error)
            alert('Не удалось добавить комментарий')
        })
        .finally(() => {
            addForm.style.display = 'flex'
            addFormLoading.style.display = 'none'
        })
}
