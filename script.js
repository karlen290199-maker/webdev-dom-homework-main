import { renderComments } from './render.js'
import {
    initLikeListeners,
    initQuoteListeners,
    initAddCommentListener,
} from './handlers.js'
import { fetchComments } from './api.js'
import { setComments } from './data.js'

async function init() {
    const comments = await fetchComments()

    setComments(comments)

    renderComments()

    initLikeListeners()
    initQuoteListeners()
    initAddCommentListener()
}

init()
