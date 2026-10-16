import { registerUser } from './api.js'
import { saveUser } from './auth.js'

const form = document.querySelector('#register-form')
const errorElement = document.querySelector('#register-error')

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    errorElement.textContent = ''

    try {
        const user = await registerUser({
            login: document.querySelector('#register-login').value,
            name: document.querySelector('#register-name').value,
            password: document.querySelector('#register-password').value,
        })

        saveUser(user)
        window.location.href = 'index.html'
    } catch (error) {
        errorElement.textContent = error.message
    }
})
