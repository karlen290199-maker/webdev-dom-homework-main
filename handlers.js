import { getComments, setComments } from './data.js'
import { renderComments, escapeHtml } from './render.js'
import { postComment, fetchComments, toggleLike } from './api.js'
import { isAuthorized, getUser } from './auth.js'

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

    if (!isAuthorized()) {
        alert('Войдите, чтобы поставить лайк')
        return
    }

    event.stopPropagation()

    const index = parseInt(button.dataset.index)

    const comments = getComments()
    const comment = comments[index]

    comment.isLikeLoading = true

    renderComments()
    initLikeListeners()
    initQuoteListeners()

    toggleLike(comment.id)
        .then((result) => {
            comment.likes = result.likes
            comment.isLiked = result.isLiked
            comment.isLikeLoading = false

            renderComments()
            initLikeListeners()
            initQuoteListeners()
        })
        .catch((error) => {
            comment.isLikeLoading = false
            renderComments()
            initLikeListeners()
            initQuoteListeners()
            alert(error.message)
        })
}

function handleQuoteClick(event) {
    if (event.target.closest('.like-button')) return

    const commentElement = event.currentTarget
    const index = parseInt(commentElement.dataset.index)

    const comments = getComments()
    const comment = comments[index]

    const textInput = document.querySelector('.add-form-text')

    const safeText = escapeHtml(comment.text)

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
    const nameInput = document.querySelector('.add-form-name')

    if (isAuthorized()) {
        const user = getUser()
        nameInput.value = user.name || user.login || ''
        nameInput.readOnly = true
    }

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
    const textInput = document.querySelector('.add-form-text')
    const addForm = document.querySelector('.add-form')
    const addFormLoading = document.querySelector('.add-form-loading')

    const text = textInput.value.trim()

    if (!text) {
        alert('Введите комментарий')
        return
    }

    if (text.length < 3) {
        alert('Комментарий должен содержать хотя бы 3 символа')
        return
    }

    addForm.style.display = 'none'
    addFormLoading.style.display = 'block'

    postComment({ text })
        .then(() => {
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
            if (error.message === 'Ошибка сервера') {
                handleAddComment()
            } else {
                alert(error.message)
            }
        })
        .finally(() => {
            addForm.style.display = 'flex'
            addFormLoading.style.display = 'none'
        })
}
