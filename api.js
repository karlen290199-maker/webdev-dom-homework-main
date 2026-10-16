const API_URL = 'https://wedev-api.sky.pro/api/v1/gleb-fokin/comments'
const AUTH_TOKEN = 'bgc0b8awbwas6g5g5k5o5s5w606g37w3cc3bo3b83k39s3co3c83c03ck'

const getHeaders = () => ({
    Authorization: `Bearer ${AUTH_TOKEN}`,
})

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

export function postComment({ name, text, token }) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            text,
        }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Не удалось добавить комментарий')
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

const USERS_API_URL = 'https://wedev-api.sky.pro/api/user'

export function loginUser({ login, password }) {
    return fetch(`${USERS_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
    }).then(async (response) => {
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Не удалось войти')
        }

        return data.user
    })
}

export function registerUser({ login, name, password }) {
    return fetch(USERS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ login, name, password }),
    }).then(async (response) => {
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Не удалось зарегистрироваться')
        }

        return data.user
    })
}
