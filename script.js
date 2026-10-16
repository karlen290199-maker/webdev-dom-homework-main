import { renderComments } from './render.js'
import {
    initLikeListeners,
    initQuoteListeners,
    initAddCommentListener,
} from './handlers.js'
import { fetchComments } from './api.js'
import { setComments } from './data.js'
import { isAuthorized, logoutUser, login } from './auth.js'

export function loadComments() {
    const loadingComments = document.querySelector('.loading-comments')
    loadingComments.style.display = 'block'

    fetchComments()
        .then((comments) => {
            setComments(comments)
            renderComments()
            initLikeListeners()
            initQuoteListeners()
        })
        .catch((error) => {
            alert(error.message)
        })
        .finally(() => {
            loadingComments.style.display = 'none'
        })
}

export function updateAuthUI() {
    const addForm = document.querySelector('.add-form')
    const loginButton = document.querySelector('.login-button')
    const logoutButton = document.querySelector('.logout-button')
    const loginForm = document.querySelector('.login-form')

    if (isAuthorized()) {
        addForm.classList.remove('hidden')
        if (loginButton) loginButton.classList.add('hidden')
        if (logoutButton) logoutButton.classList.remove('hidden')
        if (loginForm) loginForm.classList.add('hidden')
    } else {
        addForm.classList.add('hidden')
        if (loginButton) loginButton.classList.remove('hidden')
        if (logoutButton) logoutButton.classList.add('hidden')
    }
}

function initAuthListeners() {
    const loginButton = document.querySelector('.login-button')
    const logoutButton = document.querySelector('.logout-button')
    const loginForm = document.querySelector('.login-form')
    const loginSubmit = document.querySelector('.login-submit')
    const loginInput = document.querySelector('.login-input')
    const passwordInput = document.querySelector('.password-input')
    const loginError = document.querySelector('.login-error')

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            loginForm.classList.toggle('hidden')
        })
    }

    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const loginValue = loginInput.value.trim()
            const passwordValue = passwordInput.value.trim()

            if (!loginValue || !passwordValue) {
                loginError.textContent = 'Заполните все поля'
                loginError.classList.remove('hidden')
                return
            }

            loginError.classList.add('hidden')

            login(loginValue, passwordValue)
                .then(() => {
                    updateAuthUI()
                    location.reload()
                })
                .catch((error) => {
                    loginError.textContent = error.message
                    loginError.classList.remove('hidden')
                })
        })
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logoutUser()
            updateAuthUI()
            location.reload()
        })
    }
}

function init() {
    loadComments()
    initAddCommentListener()
    updateAuthUI()
    initAuthListeners()
}

init()
