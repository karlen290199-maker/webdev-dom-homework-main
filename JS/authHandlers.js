import { logoutUser } from './auth.js'
import { updateAuthUI } from './script.js'

export function initAuthListeners() {
    const loginButton = document.querySelector('.login-button')
    const logoutButton = document.querySelector('.logout-button')

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            alert('Форма логина пока не реализована')
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

