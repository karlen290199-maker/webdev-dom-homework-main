import { renderComments } from './render.js'
import {
    initLikeListeners,
    initQuoteListeners,
    initAddCommentListener,
} from './handlers.js'
import { fetchComments } from './api.js'
import { setComments } from './data.js'

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
            console.error('Ошибка загрузки:', error)
            alert('Не удалось загрузить комментарии')
        })
        .finally(() => {
            loadingComments.style.display = 'none'
        })
}

function init() {
    loadComments()

    initAddCommentListener()
}

init()
