import { renderComments } from './render.js'
import {
    initLikeListeners,
    initQuoteListeners,
    initAddCommentListener,
} from './handlers.js'
import { fetchComments } from './api.js'
import { setComments } from './data.js'

Hw4
async function init() {
    const comments = await fetchComments()

    setComments(comments)

    renderComments()

    initLikeListeners()
    initQuoteListeners()
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
            alert(error.message)
        })
        .finally(() => {
            loadingComments.style.display = 'none'
        })
}

function init() {
    loadComments()
main
    initAddCommentListener()
}

init()
