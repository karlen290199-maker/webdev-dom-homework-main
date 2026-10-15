import { loginUser } from './api.js'
import { saveUser } from './auth.js'

const form = document.querySelector('#login-form')
const errorMessage = document.querySelector('#error-message')

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    errorMessage.textContent = ''

    const login = document.querySelector('#login').value.trim()
    const password = document.querySelector('#password').value

    try {
        const user = await loginUser({ login, password })
        saveUser(user)
        window.location.href = 'index.html'
    } catch (error) {
        errorMessage.textContent = error.message
    }
})
