import { renderComments } from './render.js'
import {
    initLikeListeners,
    initQuoteListeners,
    initAddCommentListener,
} from './handlers.js'

function init() {
    renderComments()
    initLikeListeners()
    initQuoteListeners()
    initAddCommentListener()
}

init()
