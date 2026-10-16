const USER_KEY = 'comments-app-user'
const LOGIN_URL = 'https://wedev-api.sky.pro/api/user/login'

export function getUser() {
    try {
        const user = localStorage.getItem(USER_KEY)
        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}

export function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function logoutUser() {
    localStorage.removeItem(USER_KEY)
}

export function isAuthorized() {
    return getUser() !== null
}

export function getToken() {
    const user = getUser()
    return user ? user.token : null
}

export function login(loginValue, passwordValue) {
    return fetch(LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify({
            login: loginValue,
            password: passwordValue,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                return response.json().then((data) => {
                    throw new Error(data.error || 'Неверный логин или пароль')
                })
            }
            if (response.status === 500) {
                throw new Error('Ошибка сервера')
            }
            if (!response.ok) {
                throw new Error('Не удалось войти')
            }
            return response.json()
        })
        .then((data) => {
            saveUser(data.user)
            return data.user
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                throw new Error('Кажется, у вас пропал интернет')
            }
            throw error
        })
}
