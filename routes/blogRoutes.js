const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const {
	blog_index,
	blog_create_get,
	blog_create_post,
	blog_details,
	blog_delete,
} = require('../controllers/blogControllers')

const router = express.Router()

router.get('/', blog_index)

router.get('/create', requireAuth, blog_create_get)

router.post('/', requireAuth, blog_create_post)

router.get('/:id', requireAuth, blog_details)

router.delete('/:id', requireAuth, blog_delete)

module.exports = router
