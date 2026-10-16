hw8-auth
import { getToken } from './auth.js'
const API_URL = 'https://wedev-api.sky.pro/api/v1/gleb-fokin/comments'
Hw4

export async function fetchComments() {
    try {
        const response = await fetch(API_URL)

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()

        return data.comments
    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error)
        return []
    }
}

export async function postComment(commentData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(commentData),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Ответ сервера:', errorData)
        throw new Error('Не удалось добавить комментарий')
    }

    return await response.json()
const AUTH_TOKEN = 'bgc0b8awbwas6g5g5k5o5s5w606g37w3cc3bo3b83k39s3co3c83c03ck'
main

const API_URL = 'https://wedev-api.sky.pro/api/v2/gleb-fokin/comments'
const USERS_API_URL = 'https://wedev-api.sky.pro/api/user'

function getHeaders() {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function fetchComments() {
    return fetch(API_URL, {
        headers: getHeaders(),
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Ошибка сервера')
            }
            if (response.status === 401 || response.status === 403) {
                throw new Error('Ошибка авторизации: проверьте токен')
            }
            if (!response.ok) {
                throw new Error('Ошибка загрузки')
            }
            return response.json()
        })
        .then((data) => data.comments)
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })
}

export function postComment({ text }) {
    return fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(
                        data.error || 'Не удалось добавить комментарий',
                    )
                })
            }
            return response.json()
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })
}

export function toggleLike(commentId) {
    return fetch(`${API_URL}/${commentId}/toggle-like`, {
        method: 'POST',
        headers: getHeaders(),
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нужна авторизация')
            }
            if (response.status === 500) {
                throw new Error('Ошибка сервера')
            }
            if (!response.ok) {
                throw new Error('Не удалось переключить лайк')
            }
            return response.json()
        })
        .then((data) => data.result)
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })
}

export function loginUser({ login, password }) {
    return fetch(`${USERS_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.error || 'Не удалось войти')
                })
            }
            return response.json()
        })
        .then((data) => data.user)
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })
}

export function registerUser({ login, name, password }) {
    return fetch(USERS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ login, name, password }),
    })
hw8-auth
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(
                        data.error || 'Не удалось зарегистрироваться',
                    )
                })
            }
            return response.json()
        })
        .then((data) => data.user)
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })

  main
main
}
