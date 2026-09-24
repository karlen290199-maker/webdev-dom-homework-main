const API_URL = 'https://wedev-api.sky.pro/api/v1/gleb-fokin/comments'

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
        // ★ УБРАЛИ headers полностью!
        body: JSON.stringify(commentData),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Ответ сервера:', errorData)
        throw new Error('Не удалось добавить комментарий')
    }

    return await response.json()
}
