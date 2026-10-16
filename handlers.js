import { getComments, setComments } from './data.js'
import { renderComments, escapeHtml } from './render.js'
import { postComment, fetchComments } from './api.js'
import { getUser } from './auth.js'

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

    const user = getUser()

    if (!user?.token) {
        window.location.href = 'login.html'
        return
    }

    if (!name || !text) {
        alert('Пожалуйста, заполните имя и комментарий')
        return
    }

    addForm.style.display = 'none'
    addFormLoading.style.display = 'block'

    postComment({ name: user.name, text, token: user.token })
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
