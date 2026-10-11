const API_URL = 'https://wedev-api.sky.pro/api/v1/gleb-fokin/comments'

export function fetchComments() {
    return fetch(API_URL)
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Ошибка сервера')
            }
            if (!response.ok) {
                throw new Error('Ошибка загрузки')
            }
            return response.json()
        })
        .then((data) => {
            return data.comments
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })
}

export function postComment({ name, text }) {
    return fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            name,
            text,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                return response.json().then((data) => {
                    throw new Error(data.error || 'Неверные данные')
                })
            }
            if (response.status === 500) {
                throw new Error('Ошибка сервера')
            }
            if (!response.ok) {
                throw new Error('Не удалось добавить комментарий')
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
