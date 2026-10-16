const USER_KEY = 'comments-app-user'

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
