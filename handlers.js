Hw4
import { getComments } from './data.js'
import { renderComments, escapeHtml } from './render.js'
import { postComment } from './api.js'
import { getComments, setComments } from './data.js'
import { renderComments, escapeHtml } from './render.js'
hw8-auth
import { postComment, fetchComments, toggleLike } from './api.js'
import { isAuthorized, getUser } from './auth.js'

import { postComment, fetchComments } from './api.js'
import { getUser } from './auth.js'
main
main

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

Hw4
    if (comment.isLiked) {
        comment.isLiked = false
        comment.likes -= 1
    } else {
        comment.isLiked = true
        comment.likes += 1
    }
    comment.isLikeLoading = true
main

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
Hw4

    const comments = getComments()
    const comment = comments[index]
main

    const comments = getComments()
    const comment = comments[index]

    const textInput = document.querySelector('.add-form-text')

Hw4
    const authorName = comment.author?.name || comment.name || 'Без имени'
    const safeName = escapeHtml(authorName)
main
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

hw8-auth
function handleAddComment() {

async function handleAddComment() {
    const nameInput = document.querySelector('.add-form-name')
main
    const textInput = document.querySelector('.add-form-text')
    const addForm = document.querySelector('.add-form')
    const addFormLoading = document.querySelector('.add-form-loading')

    const text = textInput.value.trim()

hw8-auth
    if (!text) {
        alert('Введите комментарий')

Hw4
    const name = nameInput.value.trim()
    const text = textInput.value.trim()
    const user = getUser()

    if (!user?.token) {
        window.location.href = 'login.html'
main
        return
    }
main

    if (text.length < 3) {
        alert('Комментарий должен содержать хотя бы 3 символа')
        return
    }

Hw4
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
main
}
